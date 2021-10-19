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
        return "Sekund Note";
    }

    getIcon(): string {
        return NOTE_VIEW_ICON;
    }

    async onOpen(): Promise<void> {
        ReactDOM.render(<SekundNoteComponent view={this} />, this.containerEl.children[1]);
        this.updateOnlineStatus();
    }

}