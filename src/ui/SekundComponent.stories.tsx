import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import '/global.css';

import SekundComponent from './SekundComponent';
import { AppAction, AppActionKind, GeneralState } from '@/state/AppReducer';

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
const Template: ComponentStory<typeof SekundComponent> = (args) => {
    return <SekundComponent {...args} />
};

class GeneralStateWrapper extends React.Component {

    private gState;
    private rendered = false;

    constructor(gState: GeneralState) {
        super({});
        this.gState = gState;
    }

    setAppDispatch(ad: React.Dispatch<AppAction>) {
        if (!this.rendered) {
            ad({ type: AppActionKind.SetGeneralState, payload: this.gState });
            this.rendered = true;
        }
    }

}

export const Connecting = Template.bind({});
Connecting.args = {
    view: new GeneralStateWrapper("connecting")
};

export const LoginError = Template.bind({});
LoginError.args = {
    view: new GeneralStateWrapper("loginError")
};

export const NoApiKey = Template.bind({});
NoApiKey.args = {
    view: new GeneralStateWrapper("noApiKey")
};

export const NoSettings = Template.bind({});
NoSettings.args = {
    view: new GeneralStateWrapper("noSettings")
};

export const NoSubdomain = Template.bind({});
NoSubdomain.args = {
    view: new GeneralStateWrapper("noSubdomain")
};

export const NoSuchSubdomain = Template.bind({});
NoSuchSubdomain.args = {
    view: new GeneralStateWrapper("noSuchSubdomain")
};

export const Offline = Template.bind({});
Offline.args = {
    view: new GeneralStateWrapper("offline")
};

export const UnknownError = Template.bind({});
UnknownError.args = {
    view: new GeneralStateWrapper("unknownError")
};
