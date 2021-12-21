import { Note } from "@/domain/Note";
import i18next from "@/i18n.config";
import NoteSyncService from "@/services/NoteSyncService";
import SekundMainComponent, { MainComponentProps } from "@/ui/main/SekundMainComponent";
import SekundView from "@/ui/SekundView";
import { MAIN_VIEW_ICON, MAIN_VIEW_TYPE } from "@/_constants";
import ObjectID from "bson-objectid";
import React from "react";
import ReactDOM from "react-dom";

export default class SekundMainView extends SekundView {
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
    } as MainComponentProps;
    const InjectedTabsComponent = SekundMainComponent(props);
    ReactDOM.render(<InjectedTabsComponent />, this.containerEl.children[1]);
    this.plugin.updateOnlineStatus();
  }
}
