import PeoplesService from "@/services/PeoplesService";
import AppStateWrapper from "@/storybook/AppStateWrapper";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TFile } from "obsidian";
import React from "react";
import SekundGroupsComponentHOC, { SekundGroupsComponent } from "./SekundGroupsComponent";
import "/global.css";
import users from "@/mockdata/Users";
import ObjectID from "bson-objectid";

export default {
  title: "Sekund/Groups",
  component: SekundGroupsComponent,
} as ComponentMeta<typeof SekundGroupsComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const wrapper = new AppStateWrapper(args.gState, args.nState, null, { path: "home/home.md" } as TFile, locale);
  const peoplesService = {
    getUserGroups: () => args.groups,
    getPublicGroups: () => args.groups,
  } as PeoplesService;

  const fetchUnread = async () => {};

  const InjectedHomeComponent = SekundGroupsComponentHOC({ view: wrapper, peoplesService, fetchUnread, syncDown: (id: ObjectID) => {} });

  return <InjectedHomeComponent />;
};

const now = Date.now();

const groups = [
  {
    _id: new ObjectID(),
    name: "Pads lovers who really love hitting on small plastic squares",
    created: now,
    updated: now,
    peoples: [
      new ObjectID("6150c1ef14be465c39539ccf"),
      new ObjectID("6171606afc13ae1f35000008"),
      new ObjectID("6171606afc13ae1f3500000a"),
      new ObjectID("6171606afc13ae1f3500000e"),
      new ObjectID("6171606afc13ae1f35000010"),
      new ObjectID("6171606afc13ae1f35000012"),
      new ObjectID("6171606afc13ae1f35000003"),
      new ObjectID("6171606afc13ae1f35000005"),
    ],
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
].map((g) => ({ ...g, peoples: g.peoples.map((p) => users.filter((u: any) => u._id.equals(p))[0]) }));

export const SomeGroups = Template.bind({});
SomeGroups.args = {
  gState: "allGood",
  groups,
};

export const NoGroup = Template.bind({});
NoGroup.args = {
  gState: "allGood",
  groups: [],
};

export const PublicGroups = Template.bind({});
const groupDescriptions = [
  "For pad musicians, that is people who love doing music with primitive controllers made out of squishy plastic squares",
  "For beach lovers",
];
PublicGroups.args = {
  gState: "allGood",
  groups: groups.map((g, index) => ({ ...g, description: groupDescriptions[index], isPublic: true })),
};

export const Error = Template.bind({});
Error.args = {
  gState: "unknownError",
};
