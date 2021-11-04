import i18next from "@/i18n.config";
import NoteSyncService from "@/services/NoteSyncService";
import SekundPeoplesComponent, { PeoplesComponentProps } from "@/ui/peoples/SekundPeoplesComponent";
import SekundView from "@/ui/SekundView";
import { PEOPLES_VIEW_ICON, PEOPLES_VIEW_TYPE } from "@/_constants";
import React from "react";
import ReactDOM from "react-dom";

export default class SekundPeoplesView extends SekundView {

    getViewType(): string {
        return PEOPLES_VIEW_TYPE;
    }

    getDisplayText(): string {
        return `Sekund: ${i18next.t("plugin:openPeoplesView")}`;
    }

    getIcon(): string {
        return PEOPLES_VIEW_ICON;
    }

    async syncDown(path: string, userId: string) {
        const note = await NoteSyncService.instance.getNoteByPath(path);
        if (note) {
            NoteSyncService.instance.syncDown(note.path, userId);
        }
    }

    async onOpen(): Promise<void> {
        const props = { view: this, peoplesService: undefined, syncDown: this.syncDown } as PeoplesComponentProps;
        const InjectedNoteComponent = SekundPeoplesComponent(props);
        ReactDOM.render(<InjectedNoteComponent />, this.containerEl.children[1]);
        this.plugin.updateOnlineStatus();
    }

}