import NotesService from "@/services/NoteSyncService";
import NoteSyncService from "@/services/NoteSyncService";
import { AppAction, AppActionKind } from "@/state/AppReducer";
import SekundHomeView from "@/ui/home/SekundHomeView";
import { addIcons } from "@/ui/icons";
import SekundNoteView from "@/ui/note/SekundNoteView";
import { dispatch, getApiKeyConnection, setCurrentNoteState, setGeneralState } from "@/utils";
import { HOME_VIEW_TYPE, NOTE_VIEW_TYPE, PUBLIC_APIKEY, PUBLIC_APP_ID } from "@/_constants";
import { App, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";
import React from "react";
import * as Realm from 'realm-web';

interface SekundPluginSettings {
  apiKey: string;
  subdomain: string;
}

const DEFAULT_SETTINGS: SekundPluginSettings = {
  apiKey: "",
  subdomain: "",
};

export default class SekundPluginReact extends Plugin {

  settings: SekundPluginSettings;
  dispatchers: { [key: string]: React.Dispatch<AppAction> } = {};
  private offlineListener: EventListener;
  private onlineListener: EventListener;

  async onload() {
    await this.loadSettings();
    addIcons();

    this.registerView(NOTE_VIEW_TYPE, (leaf) => {
      return new SekundNoteView(leaf, this);
    });

    this.registerView(HOME_VIEW_TYPE, (leaf) => {
      return new SekundHomeView(leaf, this);
    });

    this.addCommand({
      id: "sekund-open-note-view",
      name: "Open Sekund Note View",
      callback: async () => {
        if (this.app.workspace.getLeavesOfType(NOTE_VIEW_TYPE).length == 0) {
          await this.app.workspace.getRightLeaf(false).setViewState({
            type: NOTE_VIEW_TYPE,
          });
        }
        this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(NOTE_VIEW_TYPE).first());
      },
    });

    this.addCommand({
      id: "sekund-open-home-view",
      name: "Open Sekund Home View",
      callback: async () => {
        if (this.app.workspace.getLeavesOfType(HOME_VIEW_TYPE).length == 0) {
          await this.app.workspace.getRightLeaf(false).setViewState({
            type: HOME_VIEW_TYPE,
          });
        }
        this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(HOME_VIEW_TYPE).first());
      },
    });

    this.addSettingTab(new SekundSettingsTab(this.app, this));
    this.app.workspace.onLayoutReady(async () => this.refreshPanes());
  }

  refreshPanes() {
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      if (leaf.getViewState().state.mode.includes("preview"))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (leaf.view as any).previewMode.rerender(true);
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
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

  public readonly attemptConnection = async (attempts: number) => {
    if (!this.settings.apiKey || this.settings.apiKey === "") {
      if (!this.settings.subdomain || this.settings.subdomain === "") {
        setGeneralState(Object.values(this.dispatchers), "noSettings");
      } else {
        setGeneralState(Object.values(this.dispatchers), "noApiKey");
      }
      return;
    }

    dispatch(Object.values(this.dispatchers), AppActionKind.SetSubdomain, this.settings.subdomain);
    setGeneralState(Object.values(this.dispatchers), "connecting");

    const appIdResult = await this.getRealmAppId();

    switch (appIdResult) {
      case "noSubdomain": // this could be redundant since we already checked for the subdomain
      case "noSuchSubdomain":
        setGeneralState(Object.values(this.dispatchers), appIdResult);
        return;
      default:
        const user = await getApiKeyConnection(new Realm.App(appIdResult), this.settings.apiKey);

        if (user) {
          setGeneralState(Object.values(this.dispatchers), "allGood");

          new NoteSyncService(user, this.settings.subdomain, Object.values(this.dispatchers));
          new NotesService(user, this.settings.subdomain, Object.values(this.dispatchers));

          this.registerEvent(this.app.workspace.on("file-open", this.handleFileOpen));
          this.registerEvent(this.app.vault.on("modify", this.handleModify));
          this.registerEvent(this.app.vault.on("rename", this.handleRename));
          // this.registerEvent(this.app.vault.on('delete',
          // this.handleDelete));

          // delay calling the backend for a bit as it seems to result in
          // network errors sometimes
          setTimeout(() => this.handleFileOpen(this.app.workspace.getActiveFile()), 2000);
        } else {
          setGeneralState(Object.values(this.dispatchers), "loginError");
        }

        break;
    }
  };


  public readonly handleFileOpen = async (file: TFile): Promise<void> => {
    NoteSyncService.instance.compareNotes(file);
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

  updateOnlineStatus() {
    if (!navigator.onLine) {
      setGeneralState(Object.values(this.dispatchers), "offline");
    }

    if (this.onlineListener) {
      window.removeEventListener("online", this.onlineListener);
    }
    if (this.offlineListener) {
      window.removeEventListener("offline", this.offlineListener);
    }
    window.addEventListener("online", (this.onlineListener = () => setTimeout(() => this.attemptConnection(0), 2000)));
    window.addEventListener("offline", (this.offlineListener = () => this.updateOnlineStatus()));

    if (navigator.onLine) {
      this.attemptConnection(0);
    }
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
    setTimeout(() => this.plugin.attemptConnection(0), 100);
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
