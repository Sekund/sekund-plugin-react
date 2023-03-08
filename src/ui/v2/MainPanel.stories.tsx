import { ComponentMeta, ComponentStory } from "@storybook/react";
import "/global.css";
import notes, { someNote } from "@/mockdata/NotesMock";
import peoples from "@/mockdata/PeoplesMock";
import users from "@/mockdata/Users";

import MainPanelWrapperHOC, { MainPanelWrapper } from "./MainPanelWrapper";
import AppStateWrapper from "@/storybook/AppStateWrapper";
import PeoplesService from "@/services/PeoplesService";
import NotesService from "@/services/NotesService";
import { Note } from "@/domain/Note";
import ObjectID from "bson-objectid";
import React from "react";
import { TFile } from "obsidian";
import PermissionsService from "@/services/PermissionsService";
import { UnreadNotes } from "@/state/AppReducer";

export default {
  title: "Sekund/Main Panel (v2)",
  component: MainPanelWrapper,
} as ComponentMeta<typeof MainPanelWrapper>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const wrapper = new AppStateWrapper(args.gState, args.nState, args.note, args.localFile, locale, peoples[0]);
  const peoplesService = {
    getUserGroups: () => args.groups,
    getPeoples: () => args.peoples,
  } as PeoplesService;
  const notesService = {
    getNotes: (oldest: number, limit: number) => args.notes,
    getUnreadNotes: () => args.unreadNotes,
  } as NotesService;
  const permissionsService = {
    getPermissions: () => args.permissions,
  } as PermissionsService;

  NotesService.instance = notesService;
  PeoplesService.instance = peoplesService;
  PermissionsService.instance = permissionsService;

  const InjectedMainPanelWrapper = MainPanelWrapperHOC({
    view: wrapper,
    unpublish: () => {},
    syncUp: () => {},
    noLocalFile: (note: Note) => {},
    syncDown: (id: ObjectID, userId: string) => {},
  });

  return <InjectedMainPanelWrapper />;
};

const now = Date.now();

const groups = [
  {
    _id: new ObjectID(),
    name: "Pads lovers",
    created: now,
    updated: now,
    peoples: [
      new ObjectID("6150c1ef14be465c39539ccf"),
      new ObjectID("6171606afc13ae1f35000008"),
      new ObjectID("6171606afc13ae1f3500000a"),
      new ObjectID("6171606afc13ae1f3500000e"),
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

export const SomePeoples = Template.bind({});
SomePeoples.args = {
  gState: "allGood",
  nState: { published: true, fileSynced: true },
  notes,
  peoples,
  groups,
  note: someNote,
  localFile: { path: "home/home.md", name: "Latour sur l'écologie et la lutte des classes" } as TFile,
};

export const Notifications = Template.bind({});
Notifications.args = {
  gState: "allGood",
  nState: { published: true, fileSynced: true },
  notes,
  peoples: [],
  groups,
  note: someNote,
  permissions: [
    {
      _id: new ObjectID(),
      userId: peoples[0]._id,
      user: peoples[0],
      created: now,
      updated: now,
      status: "requested",
    },
  ],
  unreadNotes: {
    home: [],
    groups: [],
    peoples: [],
    all: notes.slice(0, 3),
  } as UnreadNotes,
  localFile: { path: "home/home.md", name: "Latour sur l'écologie et la lutte des classes" } as TFile,
};
