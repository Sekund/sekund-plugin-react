import notes, { someNote } from "@/mockdata/NotesMock";
import peoples from "@/mockdata/PeoplesMock";
import users from "@/mockdata/Users";
import NotesService from '@/services/NotesService';
import PeoplesService from "@/services/PeoplesService";
import AppStateWrapper from '@/storybook/AppStateWrapper';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ObjectID from "bson-objectid";
import { TFile } from "obsidian";
import React from 'react';
import SekundMainComponentHOC, { SekundMainComponent } from './SekundMainComponent';
import '/global.css';

export default {
    title: 'Sekund/Main',
    component: SekundMainComponent,
} as ComponentMeta<typeof SekundMainComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new AppStateWrapper(args.gState, args.nState, args.note, args.localFile, locale);
    const peoplesService = {
        getUserGroups: () => args.groups,
        getPeoples: () => args.peoples
    } as PeoplesService;
    const notesService = {
        getNotes: (oldest: number, limit: number) => args.notes
    } as NotesService;

    const InjectedHomeComponent = SekundMainComponentHOC({
        view: wrapper,
        peoplesService,
        notesService,
        unpublish: () => { },
        syncUp: () => { },
        syncDown: (path: string, userId: string) => { },
    });

    return <InjectedHomeComponent />
};

const now = Date.now();

const groups = [
    {
        _id: new ObjectID(),
        name: "Pads lovers",
        created: now,
        updated: now,
        peoples: [new ObjectID("6150c1ef14be465c39539ccf"), new ObjectID("6171606afc13ae1f35000008"), new ObjectID("6171606afc13ae1f3500000a"), new ObjectID("6171606afc13ae1f3500000e")],
        userId: new ObjectID("6150c1ef14be465c39539ccf"),
    },
    {
        _id: new ObjectID(),
        name: "Pernambuco",
        created: now,
        updated: now,
        peoples: [new ObjectID("6150c1ef14be465c39539ccf"), new ObjectID("6171606afc13ae1f35000005"), new ObjectID("6171606afc13ae1f35000003")],
        userId: new ObjectID("6171606afc13ae1f35000003"),
    },
].map(g =>
    ({ ...g, peoples: g.peoples.map(p => users.filter((u: any) => u._id.equals(p))[0]) })
);

export const SomePeoples = Template.bind({});
SomePeoples.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: true },
    notes,
    peoples,
    groups,
    note: someNote,
    localFile: { path: "home/home.md", name: "Home" } as TFile
};

export const Empty = Template.bind({});
Empty.args = {
    gState: "allGood",
    nState: { published: false },
    notes: [],
    peoples: [],
    groups: []
};

export const Error = Template.bind({});
Error.args = {
    gState: "unknownError"
};

export const Unpublished = Template.bind({});
Unpublished.args = {
    gState: "allGood",
    nState: { fileSynced: false, fetching: false, published: false },
    notes,
    peoples,
    groups,
    localFile: { path: "home/home.md", name: "Home" } as TFile
};

export const PublishedAndSynced = Template.bind({});
PublishedAndSynced.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: true },
    notes,
    peoples,
    groups,
    note: someNote,
    localFile: { path: "home/home.md", name: "Home" } as TFile
};

export const PublishedNotSharing = Template.bind({});
PublishedNotSharing.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: true },
    notes,
    peoples,
    groups,
    note: { ...someNote, sharing: {} },
    localFile: { path: "home/home.md", name: "Home" } as TFile
};

export const PublishedSharingNoComments = Template.bind({});
PublishedSharingNoComments.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: true },
    notes,
    peoples,
    groups,
    note: { ...someNote, comments: [] },
    localFile: { path: "home/home.md", name: "Home" } as TFile
};

export const PublishedAndNotSynced = Template.bind({});
PublishedAndNotSynced.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: false },
    notes,
    peoples,
    groups,
    note: someNote,
    localFile: { path: "home/home.md", name: "Home" } as TFile
};

export const Publishing = Template.bind({});
Publishing.args = {
    gState: "allGood",
    nState: { publishing: true },
    notes,
    peoples,
    groups,
};

export const FetchingRemoteNote = Template.bind({});
FetchingRemoteNote.args = {
    gState: "allGood",
    nState: { fetching: true },
    notes,
    peoples,
    groups,
    localFile: { path: "home/home.md", name: "Home" } as TFile
};

export const Updating = Template.bind({});
Updating.args = {
    gState: "allGood",
    nState: { published: true, updating: true },
    notes,
    peoples,
    groups,
    localFile: { path: "home/home.md", name: "Home" } as TFile
};

export const NoLocalFile = Template.bind({});
NoLocalFile.args = {
    gState: "allGood",
    nState: { published: true },
    notes,
    peoples,
    groups,
    note: someNote,
    localFile: null
};

