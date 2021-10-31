import i18next from "@/i18n.config";
import NoteSyncService from "@/services/NoteSyncService";
import SekundHomeComponent, { HomeComponentProps } from "@/ui/home/SekundHomeComponent";
import SekundView from "@/ui/SekundView";
import { HOME_VIEW_ICON, HOME_VIEW_TYPE } from "@/_constants";
import React from "react";
import ReactDOM from "react-dom";

export default class SekundHomeView extends SekundView {

    getViewType(): string {
        return HOME_VIEW_TYPE;
    }

    getDisplayText(): string {
        return `Sekund: ${i18next.t("plugin:openHomeView")}`;
    }

    getIcon(): string {
        return HOME_VIEW_ICON;
    }

    async syncDown(path: string) {
        const note = await NoteSyncService.instance.getNoteByPath(path);
        if (note) {
            NoteSyncService.instance.syncDown(note);
        }
    }

    async onOpen(): Promise<void> {
        const props = { view: this, notesService: undefined, syncDown: this.syncDown } as HomeComponentProps;
        const InjectedHomeComponent = SekundHomeComponent(props);
        ReactDOM.render(<InjectedHomeComponent />, this.containerEl.children[1]);
        this.plugin.updateOnlineStatus();
    }

}