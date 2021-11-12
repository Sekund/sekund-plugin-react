import notes from "@/mockdata/NotesMock";
import NotesService from '@/services/NotesService';
import PeoplesService from "@/services/PeoplesService";
import AppStateWrapper from '@/storybook/AppStateWrapper';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TFile } from "obsidian";
import React from 'react';
import SekundMainComponentHOC, { SekundMainComponent } from './SekundMainComponent';
import '/global.css';
import peoples from "@/mockdata/PeoplesMock";

export default {
    title: 'Sekund/Main',
    component: SekundMainComponent,
} as ComponentMeta<typeof SekundMainComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new AppStateWrapper(args.gState, args.nState, null, {} as TFile, locale);
    const peoplesService = {
        getUserGroups: () => args.groups,
        getPeoples: () => args.peoples
    } as PeoplesService;
    const notesService = {
        getNotes: (oldest: number, limit: number) => args.notes
    } as NotesService;

    const InjectedHomeComponent = SekundMainComponentHOC({ view: wrapper, peoplesService, syncDown: (path: string) => { } });

    return <InjectedHomeComponent />
};

export const SomePeoples = Template.bind({});
SomePeoples.args = {
    gState: "allGood",
    nState: { published: false },
    peoples
};

export const Error = Template.bind({});
Error.args = {
    gState: "unknownError"
};
