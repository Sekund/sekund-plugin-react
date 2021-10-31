import i18next from "@/i18n.config";
import NoteSyncService from "@/services/NoteSyncService";
import SekundNoteComponent from "@/ui/note/SekundNoteComponent";
import SekundView from "@/ui/SekundView";
import { NOTE_VIEW_ICON, NOTE_VIEW_TYPE } from "@/_constants";
import React from "react";
import ReactDOM from "react-dom";

export default class SekundNoteView extends SekundView {

    getViewType(): string {
        return NOTE_VIEW_TYPE;
    }

    getDisplayText(): string {
        return `Sekund: ${i18next.t("plugin:openChatView")}`;
    }

    getIcon(): string {
        return NOTE_VIEW_ICON;
    }

    unpublish() {
        NoteSyncService.instance.unpublish();
    }

    syncUp() {
        NoteSyncService.instance.syncFile();
    }

    async onOpen(): Promise<void> {
        const props = { view: this, syncUp: this.syncUp, unpublish: this.unpublish }
        const InjectedNoteComponent = SekundNoteComponent(props);
        ReactDOM.render(<InjectedNoteComponent />, this.containerEl.children[1]);
        this.plugin.updateOnlineStatus();
    }

}