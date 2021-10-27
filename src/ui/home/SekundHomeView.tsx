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
        return "Sekund Home";
    }

    getIcon(): string {
        return HOME_VIEW_ICON;
    }

    async onOpen(): Promise<void> {
        const props = { view: this, notesService: undefined } as HomeComponentProps;
        const InjectedHomeComponent = SekundHomeComponent(props);
        ReactDOM.render(<InjectedHomeComponent />, this.containerEl.children[1]);
    }

}