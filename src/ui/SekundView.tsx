import type SekundPlugin from "@/main";
import NoteSyncService from "@/services/NoteSyncService";
import { AppContextType } from "@/state/AppContext";
import { AppActionKind } from "@/state/AppReducer";
import { ItemView, WorkspaceLeaf } from "obsidian";
import * as ReactDOM from "react-dom";

export default abstract class SekundView extends ItemView {
  plugin: SekundPlugin;
  private noteSyncService: NoteSyncService;

  constructor(leaf: WorkspaceLeaf, plugin: SekundPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  async onClose(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }

  addAppDispatch(appContext: AppContextType) {
    this.plugin.addDispatcher(appContext.appDispatch, this.getViewType())
    if (!appContext.appState.plugin) {
      appContext.appDispatch({ type: AppActionKind.SetPlugin, payload: this.plugin })
    }
  }
}
