import notes from "@/mockdata/NotesMock";
import NotesService from '@/services/NotesService';
import AppStateWrapper from '@/storybook/AppStateWrapper';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TFile } from "obsidian";
import React from 'react';
import SekundHomeComponentHOC, { SekundHomeComponent } from './SekundHomeComponent';
import '/global.css';

export default {
    title: 'Sekund/Home',
    component: SekundHomeComponent,
} as ComponentMeta<typeof SekundHomeComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new AppStateWrapper(args.gState, args.nState, null, { path: "home/home.md" } as TFile, locale);
    const notesService = {
        getNotes: (oldest: number, limit: number) => args.notes
    } as NotesService;

    const InjectedHomeComponent = SekundHomeComponentHOC({ view: wrapper, notesService, syncDown: (path: string) => { } });

    return <InjectedHomeComponent />
};

export const SomeNotes = Template.bind({});
SomeNotes.args = {
    gState: "allGood",
    nState: { published: false },
    notes
};

export const NoNotes = Template.bind({});
NoNotes.args = {
    gState: "allGood",
    nState: { published: false },
    notes: []
};

export const Error = Template.bind({});
Error.args = {
    gState: "unknownError"
};
