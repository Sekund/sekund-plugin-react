import AppStateWrapper from '@/storybook/AppStateWrapper';
import withConnectionStatus from '@/ui/withConnectionStatus';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import '/global.css';

function AllGood() {
    return <div>All is good</div>;
};

const DummyWrappedComponent = (view: { addAppDispatch: Function }) => withConnectionStatus({ view })(AllGood)

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Sekund/Connection Status',
    component: AllGood,
} as ComponentMeta<typeof AllGood>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new AppStateWrapper(args.gState, null, null, locale)
    const WrappedComponent = DummyWrappedComponent(wrapper);
    return <WrappedComponent />
};

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
