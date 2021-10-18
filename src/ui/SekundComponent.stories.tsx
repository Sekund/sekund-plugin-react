import { AppContextType } from '@/state/AppContext';
import { AppActionKind, GeneralState } from '@/state/AppReducer';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import SekundComponent from './SekundComponent';
import '/global.css';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Main Component',
    component: SekundComponent,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof SekundComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new GeneralStateWrapper(args.gState, locale)
    return <SekundComponent view={wrapper} />
};

class GeneralStateWrapper extends React.Component {

    private gState: GeneralState;
    private locale: string;

    constructor(gState: GeneralState, locale: string) {
        super({});
        this.gState = gState;
        this.locale = locale;
    }

    setAppDispatch(appContext: AppContextType) {
        if (appContext.appState.generalState !== this.gState) {
            appContext.appDispatch({ type: AppActionKind.SetGeneralState, payload: this.gState });
        }
        if (appContext.appState.subdomain !== "tailwind") {
            appContext.appDispatch({ type: AppActionKind.SetSubdomain, payload: "tailwind" });
        }
        if (appContext.appState.locale !== this.locale) {
            appContext.appDispatch({ type: AppActionKind.SetLocale, payload: this.locale });
        }
        if (appContext.appState.plugin === undefined) {
            appContext.appDispatch({ type: AppActionKind.SetPlugin, payload: { settings: { apiKey: "888555222777AAABBB", subdomain: "tailwind" } } });
        }
    }

}

export const Connecting = Template.bind({});
Connecting.args = {
    gState: "connecting"
};

export const LoginError = Template.bind({});
LoginError.args = {
    gState: "loginError"
};

export const NoApiKey = Template.bind({});
NoApiKey.args = {
    gState: "noApiKey"
};

export const NoSettings = Template.bind({});
NoSettings.args = {
    gState: "noSettings"
};

export const NoSubdomain = Template.bind({});
NoSubdomain.args = {
    gState: "noSubdomain"
};

export const NoSuchSubdomain = Template.bind({});
NoSuchSubdomain.args = {
    gState: "noSuchSubdomain"
};

export const Offline = Template.bind({});
Offline.args = {
    gState: "offline"
};

export const UnknownError = Template.bind({});
UnknownError.args = {
    gState: "unknownError"
};
