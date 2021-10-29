import GroupsService from "@/services/GroupsService";
import NotesService from "@/services/NotesService";
import NoteSyncService from "@/services/NoteSyncService";
import PeoplesService from "@/services/PeoplesService";
import UsersService from "@/services/UsersService";
import { AppAction, AppActionKind, GeneralState } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import GeneralStateWrapper from "@/storybook/AppStateWrapper";
import SekundGroupsView from "@/ui/groups/SekundGroupsView";
import SekundHomeView from "@/ui/home/SekundHomeView";
import { addIcons } from "@/ui/icons";
import SekundNoteView from "@/ui/note/SekundNoteView";
import SekundPeoplesView from "@/ui/peoples/SekundPeoplesView";
import SekundView from "@/ui/SekundView";
import { Constructor, dispatch, getApiKeyConnection, setCurrentNoteState, setGeneralState } from "@/utils";
import { GROUPS_VIEW_TYPE, HOME_VIEW_TYPE, NOTE_VIEW_TYPE, PEOPLES_VIEW_TYPE, PUBLIC_APIKEY, PUBLIC_APP_ID } from "@/_constants";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import es from 'javascript-time-ago/locale/es.json';
import fr from 'javascript-time-ago/locale/fr.json';
import nl from 'javascript-time-ago/locale/nl.json';
import { App, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";
import React from "react";
import * as Realm from 'realm-web';


TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(fr)
TimeAgo.addLocale(nl)
TimeAgo.addLocale(es)

interface SekundPluginSettings {
  apiKey: string;
  subdomain: string;
}

const DEFAULT_SETTINGS: SekundPluginSettings = {
  apiKey: "",
  subdomain: "",
};

export default class SekundPluginReact extends Plugin {

  settings: SekundPluginSettings = {} as SekundPluginSettings;
  dispatchers: { [key: string]: React.Dispatch<AppAction> } = {};
  private registeredEvents = false;
  private authenticatedUsers: { [subdomain: string]: Realm.User | null } = {};
  private offlineListener?: EventListener;
  private onlineListener?: EventListener;

  async onload() {
    await this.loadSettings();
    addIcons();

    this.registerViews([
      { type: NOTE_VIEW_TYPE, View: SekundNoteView },
      { type: HOME_VIEW_TYPE, View: SekundHomeView },
      { type: PEOPLES_VIEW_TYPE, View: SekundPeoplesView },
      { type: GROUPS_VIEW_TYPE, View: SekundGroupsView },
    ])

    this.addCommands([
      { id: "sekund-open-note-view", name: "Open Sekund Note View", type: NOTE_VIEW_TYPE },
      { id: "sekund-open-home-view", name: "Open Sekund Home View", type: HOME_VIEW_TYPE },
      { id: "sekund-open-peoples-view", name: "Open Sekund Peoples View", type: PEOPLES_VIEW_TYPE },
      { id: "sekund-open-groups-view", name: "Open Sekund Groups View", type: GROUPS_VIEW_TYPE }
    ]);


    this.addSettingTab(new SekundSettingsTab(this.app, this));
    this.app.workspace.onLayoutReady(async () => this.refreshPanes());
  }

  registerViews(specs: { type: string, View: Constructor<SekundView> }[]) {
    for (const spec of specs) {
      const { type, View } = spec;
      this.registerView(type, (leaf) => new View(leaf, this));
    }
  }

  addCommands(specs: { id: string, name: string, type: string }[]) {
    for (const spec of specs) {
      const { id, name, type } = spec;
      this.addCommand({
        id,
        name,
        callback: async () => {
          if (this.app.workspace.getLeavesOfType(type).length == 0) {
            await this.app.workspace.getRightLeaf(false).setViewState({
              type,
            });
          }
          const firstLeaf = this.app.workspace.getLeavesOfType(type).first();
          if (firstLeaf) {
            this.app.workspace.revealLeaf(firstLeaf);
          }
        },
      });
    }
  }

  refreshPanes() {
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      if (leaf.getViewState().state.mode.includes("preview"))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (leaf.view as any).previewMode.rerender(true);
    });
  }

  public getCurrentUser() {
    return this.authenticatedUsers[this.settings.subdomain];
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  public get user(): Realm.User {
    const user = this.authenticatedUsers[this.settings.subdomain];
    if (user) {
      return user;
    } else throw new Error("Attempt to access unexisting user")
  }

  public get subdomain(): string {
    return this.settings.subdomain;
  }

  private async getRealmAppId(): Promise<string | "noSubdomain" | "noSuchSubdomain"> {
    if (this.settings.subdomain && this.settings.subdomain !== "") {
      const publicUser = await getApiKeyConnection(new Realm.App(PUBLIC_APP_ID), PUBLIC_APIKEY);
      if (publicUser) {
        const subdomains = publicUser.mongoClient("mongodb-atlas").db("meta").collection("subdomains");
        const record = await subdomains.findOne({ subdomain: this.settings.subdomain });
        if (record) {
          return record.app_id;
        }
        return "noSuchSubdomain";
      } else {
        return "unknownError";
      }
    }
    return "noSubdomain";
  }

  public readonly updateOnlineStatus = async () => {
    if (!navigator.onLine) {
      Object.keys(this.authenticatedUsers).forEach(k => this.authenticatedUsers[k] = null);
      setGeneralState(Object.values(this.dispatchers), "offline");
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

    window.addEventListener("online", (this.onlineListener = () => setTimeout(() => {
      this.attemptConnection();
    }, 1000)));

    window.addEventListener("offline", (this.offlineListener = () => {
      this.updateOnlineStatus()
    }));
  }

  public readonly attemptConnection = async (): Promise<GeneralState> => {

    if (GlobalState.instance.appState.generalState === "connecting") {
      return "connecting";
    }

    setGeneralState(Object.values(this.dispatchers), "connecting");

    if (!this.settings.apiKey || this.settings.apiKey === "") {
      if (!this.settings.subdomain || this.settings.subdomain === "") {
        setGeneralState(Object.values(this.dispatchers), "noSettings");
        return 'noSettings'
      } else {
        setGeneralState(Object.values(this.dispatchers), "noApiKey");
        return 'noApiKey';
      }
    }


    const appIdResult = await this.getRealmAppId();

    switch (appIdResult) {
      case "noSubdomain": // this could be redundant since we already checked for the subdomain
      case "noSuchSubdomain":
        setGeneralState(Object.values(this.dispatchers), appIdResult);
        return appIdResult;
      default:
        const user = await getApiKeyConnection(new Realm.App(appIdResult), this.settings.apiKey);

        if (user) {
          this.authenticatedUsers[this.settings.subdomain] = user;

          const dispatchers = Object.values(this.dispatchers);

          new UsersService(this);
          new NoteSyncService(this, dispatchers);
          new NotesService(this);
          new PeoplesService(this);
          new GroupsService(this);

          const userProfile = await UsersService.instance.fetchUser();

          dispatch(dispatchers, AppActionKind.SetUserProfile, userProfile)
          setGeneralState(dispatchers, "allGood");

          if (!this.registeredEvents) {
            this.registerEvent(this.app.workspace.on("file-open", this.handleFileOpen));
            this.registerEvent(this.app.vault.on("modify", this.handleModify));
            this.registerEvent(this.app.vault.on("rename", this.handleRename));
            this.registeredEvents = true;
          }
          // this.registerEvent(this.app.vault.on('delete',
          // this.handleDelete));

          // delay calling the backend for a bit as it seems to result in
          // network errors sometimes
          setTimeout(() => this.handleFileOpen(this.app.workspace.getActiveFile()), 100);
        } else if (!user) {
          setGeneralState(Object.values(this.dispatchers), "loginError");
          return 'loginError';
        }

        break;
    }
    return 'allGood'
  };

  public readonly handleFileOpen = async (file: TFile | null): Promise<void> => {
    if (file) {
      NoteSyncService.instance.compareNotes(file);
    }
  };

  public readonly handleRename = async (file: TFile): Promise<void> => {
    NoteSyncService.instance.renameNote(file);
  };

  public readonly handleModify = async (file: TFile): Promise<void> => {
    setCurrentNoteState(Object.values(this.dispatchers), { fileSynced: false });
  };

  addDispatcher(dispatcher: React.Dispatch<AppAction>, viewType: string) {
    this.dispatchers[viewType] = dispatcher;
  }
}

class SekundSettingsTab extends PluginSettingTab {
  plugin: SekundPluginReact;

  constructor(app: App, plugin: SekundPluginReact) {
    super(app, plugin);
    this.plugin = plugin;
  }

  hide(): void {
    this.plugin.loadSettings();
    setTimeout(() => this.plugin.attemptConnection(), 100);
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Sekund API Key")
      .setDesc("To retrieve your API key, go to your Sekund Account Page -> API Key")
      .addText((text) =>
        text
          .setPlaceholder("Paste your Sekund API Key here")
          .setValue(this.plugin.settings.apiKey || "")
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Sekund subdomain")
      .setDesc("Specify your Sekund subdomain (e.g. [TEAM_NAME].sekund.io)")
      .addText((text) =>
        text
          .setPlaceholder("Subdomain")
          .setValue(this.plugin.settings.subdomain || "")
          .onChange(async (value) => {
            this.plugin.settings.subdomain = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
