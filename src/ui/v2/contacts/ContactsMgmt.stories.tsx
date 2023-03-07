import { ComponentMeta, ComponentStory } from "@storybook/react";
import "/global.css";
import notes, { someNote } from "@/mockdata/NotesMock";
import peoples from "@/mockdata/PeoplesMock";
import users from "@/mockdata/Users";

import MainPanelHOC, { MainPanel } from "../MainPanel";
import AppStateWrapper from "@/storybook/AppStateWrapper";
import PeoplesService from "@/services/PeoplesService";
import NotesService from "@/services/NotesService";
import { Note } from "@/domain/Note";
import ObjectID from "bson-objectid";
import React from "react";
import { TFile } from "obsidian";
import PermissionsService from "@/services/PermissionsService";
import { SharingPermission } from "@/domain/SharingPermission";

export default {
  title: "Sekund/Contacts (v2)",
  component: MainPanel,
} as ComponentMeta<typeof MainPanel>;

const contacts = peoples.slice(7, peoples.length - 7)
const me = peoples[0]
const incoming1 = peoples[1]
const incoming2 = peoples[2]
const outgoing1 = peoples[3]
const outgoing2 = peoples[4]
const blocked1 = peoples[5]
const blocked2 = peoples[6]

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  console.log("initializing wrapper with user: " + me.name)
  const wrapper = new AppStateWrapper(args.gState, args.nState, args.note, args.localFile, locale, me);
  const peoplesService = {
    getUserGroups: () => args.groups,
    getPeoples: () => args.peoples,
  } as PeoplesService;
  const notesService = {
    getNotes: (oldest: number, limit: number) => args.notes,
  } as NotesService;
  const permissionsService = {
    getPermissions: () => args.permissions,
  } as PermissionsService;

  NotesService.instance = notesService;
  PeoplesService.instance = peoplesService;
  PermissionsService.instance = permissionsService;

  const InjectedMainPanel = MainPanelHOC({
    view: wrapper,
    unpublish: () => {},
    syncUp: () => {},
    noLocalFile: (note: Note) => {},
    syncDown: (id: ObjectID, userId: string) => {},
  });

  return <InjectedMainPanel />;
};

const now = Date.now();

export const SharedNote = Template.bind({});
SharedNote.args = {
  gState: "allGood",
  nState: { published: true, fileSynced: true },
  notes,
  peoples: contacts,
  permissions: [
    {
      _id: new ObjectID(),
      userId: me._id, // target user id
      userInfo: me, // target user info
      user: incoming1, // requesting user info
      created: now,
      updated: now,
      status: "requested",
    } as SharingPermission,
    {
      _id: new ObjectID(),
      userId: me._id, // target user id
      userInfo: me, // target user info
      user: incoming2, // requesting user info
      created: now,
      updated: now,
      status: "requested",
    } as SharingPermission,
    {
      _id: new ObjectID(),
      userId: me._id, // target user id
      userInfo: me, // target user info
      user: blocked1, // requesting user info
      created: now,
      updated: now,
      status: "blocked",
    } as SharingPermission,
    {
      _id: new ObjectID(),
      userId: me._id, // target user id
      userInfo: me, // target user info
      user: blocked2, // requesting user info
      created: now,
      updated: now,
      status: "blocked",
    } as SharingPermission,
    {
      _id: new ObjectID(),
      userId: outgoing1._id, // target user id
      userInfo: outgoing1, // target user info
      user: me, // requesting user info
      created: now,
      updated: now,
      status: "requested",
    } as SharingPermission,
    {
      _id: new ObjectID(),
      userId: outgoing2._id, // target user id
      userInfo: outgoing2, // target user info
      user: me, // requesting user info
      created: now,
      updated: now,
      status: "requested",
    } as SharingPermission,
  ],
  groups : [],
  note: someNote,
  localFile: { path: "home/home.md", name: "Latour sur l'écologie et la lutte des classes" } as TFile,
};
