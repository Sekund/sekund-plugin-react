import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import React from "react";
import * as ReactDOM from "react-dom";
import * as Realm from "realm-web";
import type SekundPlugin from "src/main";
import NotesService from "src/NotesService";
import { AppContextType } from "src/state/AppContext";
import { AppAction, AppActionKind } from "src/state/AppReducer";
import SekundComponent from "src/ui/SekundComponent";
import { getApiKeyConnection, setGeneralState, setNoteState } from "src/utils";
import { PUBLIC_APIKEY, PUBLIC_APP_ID, VIEW_ICON, VIEW_TYPE } from "src/_constants";

export default class SekundView extends ItemView {
  plugin: SekundPlugin;
  private offlineListener: EventListener;
  private onlineListener: EventListener;
  private appDispatch: React.Dispatch<AppAction>;
  private notesService: NotesService;

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
        this.notesService = new NotesService(appIdResult, this.plugin.settings.apiKey, this.plugin.settings.subdomain, this.appDispatch);
        await this.notesService.connect();

        if (this.notesService.user) {
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
    this.notesService.compareNotes(file);
  };

  public readonly handleRename = async (file: TFile): Promise<void> => {
    this.notesService.renameNote(file);
  };

  public readonly handleModify = async (file: TFile): Promise<void> => {
    setNoteState(this.appDispatch, { fileSynced: false });
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

  setAppDispatch(appDispatch: React.Dispatch<AppAction>) {
    this.appDispatch = appDispatch;
  }

  async onOpen(): Promise<void> {
    ReactDOM.render(<SekundComponent view={this} />, this.containerEl.children[1]);
    this.updateOnlineStatus();
  }
}
