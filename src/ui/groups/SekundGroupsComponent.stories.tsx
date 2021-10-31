import PeoplesService from "@/services/PeoplesService";
import AppStateWrapper from '@/storybook/AppStateWrapper';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TFile } from "obsidian";
import React from 'react';
import SekundGroupsComponentHOC, { SekundGroupsComponent } from './SekundGroupsComponent';
import '/global.css';
import ObjectId from 'bson-objectid';
import { users } from "@/mockdata/Users";
import ObjectID from "bson-objectid";

export default {
    title: 'Sekund/Groups',
    component: SekundGroupsComponent,
} as ComponentMeta<typeof SekundGroupsComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new AppStateWrapper(args.gState, args.nState, null, {} as TFile, locale);
    const peoplesService = {
        getUserGroups: () => args.groups
    } as PeoplesService;

    const InjectedHomeComponent = SekundGroupsComponentHOC({ view: wrapper, peoplesService, syncDown: (path: string) => { } });

    return <InjectedHomeComponent />
};

const now = Date.now();

const groups = [
    {
        _id: new ObjectID(),
        name: "Pads lovers",
        created: now,
        updated: now,
        peoples: [new ObjectId("6150c1ef14be465c39539ccf"), new ObjectId("6171606afc13ae1f35000008"), new ObjectId("6171606afc13ae1f3500000a"), new ObjectId("6171606afc13ae1f3500000e")],
        userId: new ObjectId("6150c1ef14be465c39539ccf"),
    },
    {
        _id: new ObjectID(),
        name: "Pernambuco",
        created: now,
        updated: now,
        peoples: [new ObjectId("6150c1ef14be465c39539ccf"), new ObjectId("6171606afc13ae1f35000005"), new ObjectId("6171606afc13ae1f35000003")],
        userId: new ObjectId("6171606afc13ae1f35000003"),
    },
].map(g =>
    ({ ...g, peoples: g.peoples.map(p => users.filter((u: any) => new ObjectId(u._id.$oid).equals(p))[0]) })
);

export const SomeGroups = Template.bind({});
SomeGroups.args = {
    gState: "allGood",
    groups
};

export const NoGroup = Template.bind({});
NoGroup.args = {
    gState: "allGood",
    groups: []
};

export const Error = Template.bind({});
Error.args = {
    gState: "unknownError"
};
