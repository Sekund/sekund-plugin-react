import SekundGroupsComponent, { GroupsComponentProps } from "@/ui/groups/SekundGroupsComponent";
import SekundPeoplesComponent, { PeoplesComponentProps } from "@/ui/peoples/SekundPeoplesComponent";
import SekundView from "@/ui/SekundView";
import { GROUPS_VIEW_ICON, GROUPS_VIEW_TYPE, PEOPLES_VIEW_ICON, PEOPLES_VIEW_TYPE } from "@/_constants";
import React from "react";
import ReactDOM from "react-dom";
import i18next from '@/i18n.config';
import NoteSyncService from "@/services/NoteSyncService";

export default class SekundPeoplesView extends SekundView {

    getViewType(): string {
        return GROUPS_VIEW_TYPE;
    }

    getDisplayText(): string {
        return `Sekund: ${i18next.t("plugin:openGroupsView")}`;
    }

    getIcon(): string {
        return GROUPS_VIEW_ICON;
    }

    async syncDown(path: string) {
        const note = await NoteSyncService.instance.getNoteByPath(path);
        if (note) {
            NoteSyncService.instance.syncDown(note);
        }
    }

    async onOpen(): Promise<void> {
        const props = { view: this, peoplesService: undefined, syncDown: this.syncDown } as GroupsComponentProps;
        const InjectedNoteComponent = SekundGroupsComponent(props);
        ReactDOM.render(<InjectedNoteComponent />, this.containerEl.children[1]);
        this.plugin.updateOnlineStatus();
    }

}