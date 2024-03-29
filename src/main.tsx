import { Note } from "@/domain/Note";
import { mkdirs } from "@/fileutils";
import i18next from "@/i18n.config";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import GroupsService from "@/services/GroupsService";
import NotesService from "@/services/NotesService";
import NoteSyncService from "@/services/NoteSyncService";
import PeoplesService from "@/services/PeoplesService";
import PermissionsService from "@/services/PermissionsService";
// import ReferencesService from "@/services/ReferencesService";
import UsersService from "@/services/UsersService";
import { AppAction, AppActionKind, GeneralState } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import { OWN_NOTE_OUTDATED } from "@/state/NoteStates";
import ContactIndexBlock from "@/ui/blocks/ContactIndexBlock";
import DiscussionBlock from "@/ui/blocks/DiscussionBlock";
import GroupIndexBlock from "@/ui/blocks/GroupIndexBlock";
import { addIcons } from "@/ui/icons";
// import SekundMainView from "@/ui/main/SekundMainView";
import MainView from "@/ui/v2/MainView";
import SekundView from "@/ui/SekundView";
import { FolderSuggest } from "@/ui/settings/FolderSuggest";
import { Constructor, dispatch, getApiKeyConnection, isSharedNoteFile, makeid, setCurrentNoteState, setGeneralState } from "@/utils";
import { MAIN_VIEW_TYPE, PUBLIC_APP_ID } from "@/_constants";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import es from "javascript-time-ago/locale/es.json";
import fr from "javascript-time-ago/locale/fr.json";
import nl from "javascript-time-ago/locale/nl.json";
import { App, MarkdownView, Modal, normalizePath, Plugin, PluginSettingTab, Setting, TFile, TFolder, WorkspaceLeaf } from "obsidian";
import posthog from "posthog-js";
import React from "react";
import ReactDOM from "react-dom";
import * as Realm from "realm-web";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(fr);
TimeAgo.addLocale(nl);
TimeAgo.addLocale(es);

class SekundPluginSettings {
  private _apiKeys: { [subdomain: string]: string } = {};
  public subdomain = "";
  public notePanelHeight: number | undefined = undefined;
  public sekundFolderPath = "__sekund__";

  public constructor() {}

  get apiKey() {
    return this._apiKeys[this.subdomain];
  }

  get apiKeys() {
    return this._apiKeys;
  }

  set apiKey(k: string) {
    this._apiKeys[this.subdomain] = k;
  }

  public deleteApiKey(subdomain: string) {
    delete this._apiKeys[subdomain];
  }

  public addApiKey(subdomain: string, apiKey: string) {
    this._apiKeys[subdomain] = apiKey;
  }
}

export default class SekundPluginReact extends Plugin {
  settings: SekundPluginSettings = new SekundPluginSettings();
  private viewDispatchers: { [key: string]: React.Dispatch<AppAction> } = {};
  private registeredEvents = false;
  private registeredMDCodeBlockProcessors = false;
  private authenticatedUsers: { [subdomain: string]: Realm.User | null } = {};
  private offlineListener?: EventListener;
  private onlineListener?: EventListener;
  private notesListenerId = "";
  private postHogApiKey: string | undefined;
  private postHogApiHost: string | undefined;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SekundSettingsTab(this.app, this));

    new GlobalState();
    addIcons();

    this.addRibbonIcon("sekund-icon", "Sekund Panes", (evt: MouseEvent) => {
      this.showPane(MAIN_VIEW_TYPE);
    });

    this.registerViews([{ type: MAIN_VIEW_TYPE, View: MainView }]);

    this.app.workspace.onLayoutReady(async () => {
      this.refreshPanes();
      this.showPane(MAIN_VIEW_TYPE);
    });
  }

  onunload(): void {
    [MAIN_VIEW_TYPE].forEach((t) => {
      this.app.workspace.getLeavesOfType(t).forEach((leaf) => leaf.detach());
    });
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.removeEventListener(this.notesListenerId);
  }

  public registerMarkdownCodeBlockProcessors() {
    this.registerMarkdownCodeBlockProcessor("sekund", async (source: string, el: HTMLElement, ctx: any) => {
      setTimeout(async () => {
        console.log("source: ", source);
        if (source.trim().startsWith("discussion")) {
          const notePath = ctx.sourcePath;
          const note = await NoteSyncService.instance.getNoteByPath(notePath);
          if (note) {
            const root = ReactDOM.render(<DiscussionBlock note={note} />, el);
            ctx.addChild(root);
          }
        } else if (source.trim().startsWith("contact-index")) {
          const contactId = source.trim().split(" ")[1];
          if (contactId) {
            const root = ReactDOM.render(<ContactIndexBlock contactId={contactId} />, el);
            ctx.addChild(root);
          }
        } else if (source.trim().startsWith("group-index")) {
          const groupId = source.trim().split(" ")[1];
          if (groupId) {
            const root = ReactDOM.render(<GroupIndexBlock groupId={groupId} />, el);
            ctx.addChild(root);
          }
        }
      }, 200);
    });
  }

  public async openIndexFile(type: "contact" | "group", id: string) {
    const vault = this.app.vault;
    const { sekundFolderPath } = this.settings;
    const path = type === "contact" ? `${sekundFolderPath}/${id}/index.md` : `${sekundFolderPath}/${id}.md`;
    let file = vault.getAbstractFileByPath(path);
    if (!file) {
      if (type === "contact" && !vault.getAbstractFileByPath(`${sekundFolderPath}/${id}`)) {
        await vault.createFolder(`${sekundFolderPath}/${id}`);
      }
      const backticks = "```";
      file = await vault.create(
        path,
        `${backticks}sekund
${type}-index ${id}
${backticks}

`
      );
    }
    if (file && file instanceof TFile) {
      const leaves = this.app.workspace.getLeavesOfType("markdown");
      let leaf: WorkspaceLeaf;
      if (leaves.length > 0) {
        leaf = this.app.workspace.createLeafBySplit(leaves[0], "vertical", true);
      } else {
        leaf = this.app.workspace.getLeaf(true);
      }
      leaf.openFile(file, { active: false });
      leaf.setViewState({ type: "markdown" });
    }
  }

  public disconnect() {
    this.settings.deleteApiKey(this.settings.subdomain);
    this.settings.subdomain = "";
    this.saveSettings();
    this.attemptConnection(true);
  }

  registerViews(specs: { type: string; View: Constructor<SekundView> }[]) {
    for (const spec of specs) {
      const { type, View } = spec;
      this.registerView(type, (leaf) => new View(leaf, this));
    }
  }

  public get notesSyncService() {
    return NoteSyncService.instance;
  }

  async showPane(type: string) {
    if (this.app.workspace.getLeavesOfType(type).length == 0) {
      await this.app.workspace.getRightLeaf(false).setViewState({
        type,
      });
    }
    const firstLeaf = this.app.workspace.getLeavesOfType(type).first();
    if (firstLeaf) {
      this.app.workspace.revealLeaf(firstLeaf);
    }
  }

  refreshPanes() {
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      if (leaf.view instanceof MarkdownView && leaf.view.getMode() === "preview") leaf.view.previewMode.rerender(true);
    });
  }

  public about() {
    const aboutModal = new AboutModal(this.app);
    aboutModal.open();
  }

  public getCurrentUser() {
    return this.authenticatedUsers[this.settings.subdomain];
  }

  async loadSettings() {
    const settings = await this.loadData();
    if (settings && settings.apiKey) {
      this.settings = new SekundPluginSettings();
      this.settings.subdomain = settings.subdomain;
      this.settings.sekundFolderPath = settings.sekundFolderPath;
      this.settings.notePanelHeight = settings.notePanelHeight;
      this.settings.addApiKey(settings.subdomain, settings.apiKey);
      this.saveSettings();
    } else {
      if (settings) {
        this.settings = new SekundPluginSettings();
        this.settings.subdomain = settings.subdomain;
        this.settings.sekundFolderPath = settings.sekundFolderPath;
        this.settings.notePanelHeight = settings.notePanelHeight;
        for (const subdomain of Object.keys(settings._apiKeys)) {
          this.settings.addApiKey(subdomain, settings._apiKeys[subdomain]);
        }
      } else {
        this.settings = new SekundPluginSettings();
        this.settings.sekundFolderPath = "__sekund__";
      }
    }
  }

  async addApiKey(subdomain: string, apiKey: string) {
    this.settings.addApiKey(subdomain, apiKey);
    this.settings.subdomain = subdomain;
    await this.saveSettings();
  }

  async deleteApiKey(subdomain: string) {
    this.settings.deleteApiKey(subdomain);
    await this.saveSettings();
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  public get user(): Realm.User {
    const user = this.authenticatedUsers[this.settings.subdomain];
    if (user) {
      return user;
    } else throw new Error("Attempt to access unexisting user");
  }

  public get subdomain(): string {
    return this.settings.subdomain;
  }

  public async getRealmAppId(subdomain: string): Promise<string | "noSubdomain" | "noSuchSubdomain"> {
    const anonymousUser = await new Realm.App(PUBLIC_APP_ID).logIn(Realm.Credentials.anonymous());
    if (subdomain.trim() === "") {
      return "noSubdomain";
    }
    if (anonymousUser) {
      const subdomains = anonymousUser.mongoClient("mongodb-atlas").db("meta").collection("subdomains");
      const record = await subdomains.findOne({ subdomain });
      if (record) {
        this.postHogApiKey = record.postHogApiKey;
        this.postHogApiHost = record.postHogApiHost;
        this.updateMetaDocuments(anonymousUser);
        return record.app_id;
      }
      anonymousUser.logOut();
      return "noSuchSubdomain";
    } else {
      return "unknownError";
    }
  }

  public async startCapturing() {
    const user = this.authenticatedUsers[this.settings.subdomain];
    if (user && this.postHogApiHost && this.postHogApiKey && user.customData.consentedToTrackBehaviouralDataInOrderToImproveTheProduct) {
      posthog.init(this.postHogApiKey, {
        api_host: this.postHogApiHost,
        loaded: () => {
          posthog.identify(user.customData.email as string);
          posthog.people.set({ email: user.customData.email });
          posthog.opt_in_capturing();
          console.log(`starting capturing data for ${user.customData.email} now.`);
        },
      });
    }
  }

  private async updateMetaDocuments(publicUser: any) {
    // remove **README** file that's creating issues with Android
    const file = this.app.vault.getAbstractFileByPath(normalizePath(`${this.settings.sekundFolderPath}/**README**.md`));
    if (file) {
      await this.app.vault.delete(file);
    }
    const documents = publicUser.mongoClient("mongodb-atlas").db("meta").collection("documents");
    const readme = await documents.findOne({ title: "**README**" });
    await this.loadSettings();
    if (readme) {
      await mkdirs(normalizePath(this.settings.sekundFolderPath), this.app.vault.adapter);
      await this.app.vault.adapter.write(normalizePath(`${this.settings.sekundFolderPath}/README.md`), readme.content);
    }
  }

  public async openNoteFile(note: Note) {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(note.path));
    if (file) {
      await this.app.workspace.getMostRecentLeaf().openFile(file as TFile);
    } else {
      NoteSyncService.instance.noLocalFile(note);
    }
  }

  public readonly updateOnlineStatus = async () => {
    if (!navigator.onLine) {
      Object.keys(this.authenticatedUsers).forEach((k) => (this.authenticatedUsers[k] = null));
      setGeneralState(this.dispatchers, "offline");
    }

    if (this.onlineListener) {
      window.removeEventListener("online", this.onlineListener);
    }

    if (this.offlineListener) {
      window.removeEventListener("offline", this.offlineListener);
    }

    if (navigator.onLine) {
      await this.attemptConnection();
    }

    this.registerDomEvent(
      window,
      "online",
      (this.onlineListener = () =>
        setTimeout(() => {
          this.attemptConnection();
        }, 1000))
    );

    this.registerDomEvent(
      window,
      "offline",
      (this.offlineListener = () => {
        this.updateOnlineStatus();
      })
    );
  };

  public readonly attemptConnection = async (force?: boolean): Promise<GeneralState> => {
    const authUser = this.authenticatedUsers[this.settings.subdomain];
    if (!force && authUser && authUser.isLoggedIn) {
      return "allGood";
    }

    if (!force && GlobalState.instance.appState.generalState === "connecting") {
      return "connecting";
    }

    setGeneralState(this.dispatchers, "connecting");

    if (!this.settings.apiKey || this.settings.apiKey === "") {
      if (!this.settings.subdomain || this.settings.subdomain === "") {
        setGeneralState(this.dispatchers, "noSettings");
        return "noSettings";
      } else {
        setGeneralState(this.dispatchers, "noApiKey");
        return "noApiKey";
      }
    }

    const appIdResult = await this.getRealmAppId(this.settings.subdomain);

    switch (appIdResult) {
      case "noSubdomain": // this could be redundant since we already checked for the subdomain
      case "noSuchSubdomain":
        setGeneralState(this.dispatchers, appIdResult);
        return appIdResult;
      default:
        const user = await getApiKeyConnection(new Realm.App(appIdResult), this.settings.apiKey);

        if (user) {
          this.authenticatedUsers[this.settings.subdomain] = user;
          this.startCapturing();

          try {
            new UsersService(this);
            new NoteSyncService(this);
            new NotesService(this);
            new PeoplesService(this);
            new GroupsService(this);
            new PermissionsService(this);
            new EventsWatcherService(this);
            // new ReferencesService(this);

            this.watchNotes();
          } catch (err) {
            return "unknownError";
          }

          const userProfile = await UsersService.instance.fetchUser();

          dispatch(this.dispatchers, AppActionKind.SetUserProfile, userProfile);
          setGeneralState(this.dispatchers, "allGood");

          if (!this.registeredEvents) {
            this.registerEvent(this.app.workspace.on("file-open", this.handleFileOpen));
            this.registerEvent(this.app.vault.on("modify", this.handleModify));
            this.registerEvent(this.app.vault.on("rename", this.handleRename));
            // this.registerEvent(this.app.vault.on('delete',
            // this.handleDelete));
            this.registeredEvents = true;
          }

          if (!this.registeredMDCodeBlockProcessors) {
            this.registerMarkdownCodeBlockProcessors();
          }

          // delay calling the backend for a bit as it seems to result in
          // network errors sometimes
          setTimeout(() => this.handleFileOpen(this.app.workspace.getActiveFile()), 100);
        } else if (!user) {
          setGeneralState(this.dispatchers, "loginError");
          return "loginError";
        }

        break;
    }
    return "allGood";
  };

  watchNotes = () => {
    this.notesListenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(
      this.notesListenerId,
      new SekundEventListener(["note.rename"], (fullDocument: any) => {
        const updtNote: Note = fullDocument.data;
        NoteSyncService.instance.renameSharedNote(updtNote);
      })
    );
  };

  public readonly handleFileOpen = async (file: TFile | null): Promise<void> => {
    if (file) {
      NoteSyncService.instance.compareNotes(file);
    }
  };

  public readonly handleRename = async (file: TFile, oldPath?: string): Promise<void> => {
    if (!isSharedNoteFile(file) && oldPath) {
      NoteSyncService.instance.renameNote(file, oldPath);
    } else {
      console.log("file inside sekund folder was renamed, thus doing nothing");
    }
  };

  public readonly handleModify = async (file: TFile): Promise<void> => {
    if (!isSharedNoteFile(file)) {
      setCurrentNoteState(this.dispatchers, OWN_NOTE_OUTDATED, file, undefined);
    }
  };

  addDispatcher(dispatcher: React.Dispatch<AppAction>, viewType: string) {
    this.viewDispatchers[viewType] = dispatcher;
  }

  removeDispatcher(viewType: string) {
    delete this.viewDispatchers[viewType];
  }

  get dispatchers() {
    return Object.values(this.viewDispatchers);
  }

  async moveFolder(previousFolderPath: string, newFolderPath: string) {
    if (previousFolderPath === newFolderPath || newFolderPath === "" || newFolderPath === "/") {
      return;
    }
    const previousFolder = this.app.vault.getAbstractFileByPath(previousFolderPath);
    if (previousFolder && previousFolder instanceof TFolder) {
      for (const child of previousFolder.children) {
        await this.app.vault.rename(child, `${newFolderPath}/${child.name}`);
      }
    }
  }
}

class AboutModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl, titleEl } = this;
    const { t } = i18next;
    titleEl.innerHTML = `<div style="text-align:center">${t("about")}</div>`;
    contentEl.innerHTML = `
    <div style="text-align:center">
      <p><b>${i18next.t("author")}</b></p>
      <p style="font-size: 85%">Candide Kemmler</p>
      <p><b>${i18next.t("contributors")}</b></p>
      <p style="font-size: 85%">Laurent De Saedeleer (UX)</p>
      <p style="margin-top:1rem">Version: 1.0.69</p>
    </div>
    `;
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

class SekundSettingsTab extends PluginSettingTab {
  plugin: SekundPluginReact;

  constructor(app: App, plugin: SekundPluginReact) {
    super(app, plugin);
    this.plugin = plugin;
  }

  hide(): void {
    this.plugin.saveSettings();
    setTimeout(() => this.plugin.attemptConnection(), 100);
  }

  display(): void {
    let { containerEl } = this;
    const { t } = i18next;

    containerEl.empty();

    function getFolderDescFragment() {
      const fragment = document.createDocumentFragment();
      const desc = document.createElement("p");
      desc.innerHTML = t("sekundFolderDesc");
      fragment.appendChild(desc);
      const warning = document.createElement("p");
      warning.innerHTML = t("sekundFolderWarning");
      fragment.appendChild(warning);
      return fragment;
    }

    new Setting(containerEl)
      .setName(t("sekundFolder"))
      .setDesc(getFolderDescFragment())
      .addSearch((cb) => {
        new FolderSuggest(this.app, cb.inputEl);
        cb.setPlaceholder("Example: folder1/folder2")
          .setValue(this.plugin.settings.sekundFolderPath)
          .onChange(async (new_folder) => {
            if (await this.plugin.app.vault.adapter.exists(normalizePath(new_folder))) {
              this.plugin.settings.sekundFolderPath = new_folder;
              this.plugin.saveSettings();
            }
          });
      });
  }
}
