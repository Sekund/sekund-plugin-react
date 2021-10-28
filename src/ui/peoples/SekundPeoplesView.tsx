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
        return "Sekund Peoples";
    }

    getIcon(): string {
        return PEOPLES_VIEW_ICON;
    }

    async onOpen(): Promise<void> {
        const props = { view: this, peoplesService: undefined } as PeoplesComponentProps;
        const InjectedNoteComponent = SekundPeoplesComponent(props);
        ReactDOM.render(<InjectedNoteComponent />, this.containerEl.children[1]);
        this.plugin.updateOnlineStatus();
    }

}