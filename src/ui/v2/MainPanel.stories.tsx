import { ComponentMeta, ComponentStory } from "@storybook/react";
import "/global.css";
import notes, { someNote } from "@/mockdata/NotesMock";
import peoples from "@/mockdata/PeoplesMock";
import users from "@/mockdata/Users";

import MainPanelHOC, { MainPanel } from "./MainPanel";
import AppStateWrapper from "@/storybook/AppStateWrapper";
import PeoplesService from "@/services/PeoplesService";
import NotesService from "@/services/NotesService";
import { Note } from "@/domain/Note";
import ObjectID from "bson-objectid";
import React from "react";
import { TFile } from "obsidian";

export default {
  title: "Sekund/Main Panel (v2)",
  component: MainPanel,
} as ComponentMeta<typeof MainPanel>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const wrapper = new AppStateWrapper(args.gState, args.nState, args.note, args.localFile, locale);
  const peoplesService = {
    getUserGroups: () => args.groups,
    getPeoples: () => args.peoples,
  } as PeoplesService;
  const notesService = {
    getNotes: (oldest: number, limit: number) => args.notes,
  } as NotesService;

  const InjectedMainPanel = MainPanelHOC({
    view: wrapper,
    peoplesService,
    notesService,
    unpublish: () => {},
    syncUp: () => {},
    noLocalFile: (note: Note) => {},
    syncDown: (id: ObjectID, userId: string) => {},
  });

  return <InjectedMainPanel />;
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
