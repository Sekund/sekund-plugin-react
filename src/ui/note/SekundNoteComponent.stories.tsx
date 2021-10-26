import AppStateWrapper from '@/storybook/AppStateWrapper';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import SekundNoteComponentHOC, { SekundNoteComponent } from './SekundNoteComponent';
import '/global.css';
import notes from "@/mockdata/NotesMock";
import { TFile } from 'obsidian';

export default {
    title: 'Sekund/Note',
    component: SekundNoteComponent,
} as ComponentMeta<typeof SekundNoteComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new AppStateWrapper(args.gState, args.nState, args.note, args.localFile, locale);

    const InjectedNoteComponent = SekundNoteComponentHOC({ view: wrapper });

    return <InjectedNoteComponent />
};

export const Unpublished = Template.bind({});
Unpublished.args = {
    gState: "allGood",
    nState: { fileSynced: false, fetching: false, published: false },
    localFile: {} as TFile
};

export const PublishedAndSynced = Template.bind({});
PublishedAndSynced.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: true },
    note: notes[10],
    localFile: {} as TFile

};

export const PublishedNotSharing = Template.bind({});
PublishedNotSharing.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: true },
    note: { ...notes[10], sharing: {} },
    localFile: {} as TFile
};

export const PublishedSharingNoComments = Template.bind({});
PublishedSharingNoComments.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: true },
    note: { ...notes[10], comments: [] },
    localFile: {} as TFile
};

export const PublishedAndNotSynced = Template.bind({});
PublishedAndNotSynced.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: false },
    note: notes[10],
    localFile: {} as TFile
};

export const Publishing = Template.bind({});
Publishing.args = {
    gState: "allGood",
    nState: { publishing: true }
};

export const FetchingRemoteNote = Template.bind({});
FetchingRemoteNote.args = {
    gState: "allGood",
    nState: { fetching: true },
    localFile: {} as TFile
};

export const Synchronizing = Template.bind({});
Synchronizing.args = {
    gState: "allGood",
    nState: { published: true, synchronizing: true },
    localFile: {} as TFile
};

export const NoLocalFile = Template.bind({});
NoLocalFile.args = {
    gState: "allGood",
    nState: { published: true },
    localFile: null
};


export const Error = Template.bind({});
Error.args = {
    gState: "unknownError"
};
