import NotesService from "@/services/NotesService";
import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import React from "react";
import * as ReactDOM from "react-dom";
import * as Realm from "realm-web";
import type SekundPlugin from "@/main";
import NoteSyncService from "@/services/NoteSyncService";
import { AppAction, AppActionKind } from "@/state/AppReducer";
import SekundComponent from "@/ui/SekundComponent";
import { getApiKeyConnection, setCurrentNoteState, setGeneralState } from "@/utils";
import { PUBLIC_APIKEY, PUBLIC_APP_ID, VIEW_ICON, VIEW_TYPE } from "@/_constants";
import { AppContextType } from "@/state/AppContext";

export default class SekundView extends ItemView {
  plugin: SekundPlugin;
  private offlineListener: EventListener;
  private onlineListener: EventListener;
  private appDispatch: React.Dispatch<AppAction>;
  private noteSyncService: NoteSyncService;

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Sekund";
  }

  getIcon(): string {
    return VIEW_ICON;
  }

  constructor(leaf: WorkspaceLeaf, plugin: SekundPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  private async getRealmAppId(): Promise<string | "noSubdomain" | "noSuchSubdomain"> {
    if (this.plugin.settings.subdomain && this.plugin.settings.subdomain !== "") {
      const publicUser = await getApiKeyConnection(new Realm.App(PUBLIC_APP_ID), PUBLIC_APIKEY);
      if (publicUser) {
        const subdomains = publicUser.mongoClient("mongodb-atlas").db("meta").collection("subdomains");
        const record = await subdomains.findOne({ subdomain: this.plugin.settings.subdomain });
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
    if (!this.plugin.settings.apiKey || this.plugin.settings.apiKey === "") {
      if (!this.plugin.settings.subdomain || this.plugin.settings.subdomain === "") {
        setGeneralState(this.appDispatch, "noSettings");
      } else {
        setGeneralState(this.appDispatch, "noApiKey");
      }
      return;
    }

    this.appDispatch({ type: AppActionKind.SetSubdomain, payload: this.plugin.settings.subdomain });
    setGeneralState(this.appDispatch, "connecting");

    const appIdResult = await this.getRealmAppId();

    switch (appIdResult) {
      case "noSubdomain": // this could be redundant since we already checked for the subdomain
      case "noSuchSubdomain":
        setGeneralState(this.appDispatch, appIdResult);
        return;
      default:
        const user = await getApiKeyConnection(new Realm.App(appIdResult), this.plugin.settings.apiKey);

        if (user) {
          this.noteSyncService = new NoteSyncService(user, this.plugin.settings.subdomain, this.appDispatch);
          new NotesService(user, this.plugin.settings.subdomain);

          setGeneralState(this.appDispatch, "allGood");

          this.registerEvent(this.app.workspace.on("file-open", this.handleFileOpen));
          this.registerEvent(this.app.vault.on("modify", this.handleModify));
          this.registerEvent(this.app.vault.on("rename", this.handleRename));
          // this.registerEvent(this.app.vault.on('delete',
          // this.handleDelete));

          // delay calling the backend for a bit as it seems to result in
          // network errors sometimes
          setTimeout(() => this.handleFileOpen(this.app.workspace.getActiveFile()), 2000);
        } else {
          setGeneralState(this.appDispatch, "loginError");
        }

        break;
    }
  };

  public readonly handleFileOpen = async (file: TFile): Promise<void> => {
    this.noteSyncService.compareNotes(file);
  };

  public readonly handleRename = async (file: TFile): Promise<void> => {
    this.noteSyncService.renameNote(file);
  };

  public readonly handleModify = async (file: TFile): Promise<void> => {
    setCurrentNoteState(this.appDispatch, { fileSynced: false });
  };

  async onClose(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }

  updateOnlineStatus() {
    if (!navigator.onLine) {
      setGeneralState(this.appDispatch, "offline");
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

  setAppDispatch(appContext: AppContextType) {
    this.appDispatch = appContext.appDispatch;
  }

  async onOpen(): Promise<void> {
    const darkMode = this.containerEl.closest('theme-dark') !== null;
    ReactDOM.render(<SekundComponent view={this} />, this.containerEl.children[1]);
    this.updateOnlineStatus();
  }
}
