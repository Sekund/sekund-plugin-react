import PeoplesService from "@/services/PeoplesService";
import AppStateWrapper from '@/storybook/AppStateWrapper';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TFile } from "obsidian";
import React from 'react';
import SekundPeoplesComponentHOC, { SekundPeoplesComponent } from './SekundPeoplesComponent';
import '/global.css';
import peoples from "@/mockdata/PeoplesMock";

export default {
    title: 'Sekund/Peoples',
    component: SekundPeoplesComponent,
} as ComponentMeta<typeof SekundPeoplesComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new AppStateWrapper(args.gState, args.nState, null, {} as TFile, locale);
    const peoplesService = {
        getPeoples: () => args.peoples
    } as PeoplesService;

    const InjectedHomeComponent = SekundPeoplesComponentHOC({ view: wrapper, peoplesService });

    return <InjectedHomeComponent />
};

export const SomePeoples = Template.bind({});
SomePeoples.args = {
    gState: "allGood",
    peoples
};

export const NoOne = Template.bind({});
NoOne.args = {
    gState: "allGood",
    peoples: []
};

export const Error = Template.bind({});
Error.args = {
    gState: "unknownError"
};
