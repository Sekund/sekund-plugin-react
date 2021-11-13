import notes from "@/mockdata/NotesMock";
import peoples from "@/mockdata/PeoplesMock";
import { users } from "@/mockdata/Users";
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
    const wrapper = new AppStateWrapper(args.gState, args.nState, null, {} as TFile, locale);
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
    ({ ...g, peoples: g.peoples.map(p => users.filter((u: any) => new ObjectID(u._id.$oid).equals(p))[0]) })
);

export const SomePeoples = Template.bind({});
SomePeoples.args = {
    gState: "allGood",
    nState: { published: false },
    notes,
    peoples,
    groups
};

export const Error = Template.bind({});
Error.args = {
    gState: "unknownError"
};
