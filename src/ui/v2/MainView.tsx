import { Note } from "@/domain/Note";
import NoteSyncService from "@/services/NoteSyncService";
import MainPanel, { MainPanelProps } from "./MainPanel";
import SekundView from "@/ui/SekundView";
import { MAIN_VIEW_ICON, MAIN_VIEW_TYPE } from "@/_constants";
import ObjectID from "bson-objectid";
import React from "react";
import ReactDOM from "react-dom";
import MainPanelWrapper from "@/ui/v2/MainPanelWrapper";

export default class MainView extends SekundView {
  getViewType(): string {
    return MAIN_VIEW_TYPE;
  }

  getDisplayText(): string {
    return `Sekund`;
  }

  getIcon(): string {
    return MAIN_VIEW_ICON;
  }

  async syncDown(id: ObjectID, userId: string) {
    NoteSyncService.instance.syncDown(id, userId);
  }

  noLocalFile(note: Note) {
    NoteSyncService.instance.noLocalFile(note);
  }

  unpublish() {
    NoteSyncService.instance.unpublish();
  }

  syncUp() {
    NoteSyncService.instance.syncFile();
  }

  async onOpen(): Promise<void> {
    const props = {
      view: this,
      peoplesService: undefined,
      notesService: undefined,
      syncDown: this.syncDown,
      syncUp: this.syncUp,
      unpublish: this.unpublish,
      noLocalFile: this.noLocalFile,
    } as MainPanelProps;
    const InjectedMainPanel = MainPanelWrapper(props);
    ReactDOM.render(<InjectedMainPanel />, this.containerEl.children[1]);
    this.plugin.updateOnlineStatus();
  }
}
