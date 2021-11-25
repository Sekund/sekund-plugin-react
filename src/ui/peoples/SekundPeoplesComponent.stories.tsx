import peoples from "@/mockdata/PeoplesMock";
import AppStateWrapper from "@/storybook/AppStateWrapper";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TFile } from "obsidian";
import React from "react";
import SekundPeoplesComponentHOC, { SekundPeoplesComponent } from "./SekundPeoplesComponent";
import "/global.css";
import notes from "@/mockdata/NotesMock";
import NotesService from "@/services/NotesService";

export default {
  title: "Sekund/Peoples",
  component: SekundPeoplesComponent,
} as ComponentMeta<typeof SekundPeoplesComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const wrapper = new AppStateWrapper(args.gState, args.nState, null, { path: "home/home.md" } as TFile, locale);
  const notesService = {
    getNotes: (oldest: number, limit: number) => args.notes,
  } as NotesService;

  const InjectedHomeComponent = SekundPeoplesComponentHOC({ view: wrapper, notesService, syncDown: (path: string) => {} });

  return <InjectedHomeComponent />;
};

export const SomePeoples = Template.bind({});
SomePeoples.args = {
  gState: "allGood",
  notes,
};

export const FewPeoples = Template.bind({});
FewPeoples.args = {
  gState: "allGood",
  notes: notes.slice(0, 2),
};

export const NoOne = Template.bind({});
NoOne.args = {
  gState: "allGood",
  notes: [],
};

export const Error = Template.bind({});
Error.args = {
  gState: "unknownError",
};
