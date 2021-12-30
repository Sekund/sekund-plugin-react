import { someNote } from "@/mockdata/NotesMock";
import AppStateWrapper from "@/storybook/AppStateWrapper";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ObjectID from "bson-objectid";
import { TFile } from "obsidian";
import React from "react";
import SekundNoteComponentHOC, { SekundNoteComponent } from "./SekundNoteComponent";
import "/global.css";

export default {
  title: "Sekund/Note",
  component: SekundNoteComponent,
} as ComponentMeta<typeof SekundNoteComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const wrapper = new AppStateWrapper(args.gState, args.nState, args.note, args.localFile, locale);

  const InjectedNoteComponent = SekundNoteComponentHOC({
    view: wrapper,
    syncUp: () => {},
    syncDown: (id: ObjectID, userId: string) => {},
    unpublish: () => {},
  });

  return <InjectedNoteComponent />;
};

export const Unpublished = Template.bind({});
Unpublished.args = {
  gState: "allGood",
  nState: { fileSynced: false, fetching: false, published: false },
  note: null,
  localFile: { path: "home/home.md", name: "Home" } as TFile,
};

export const PublishedAndSynced = Template.bind({});
PublishedAndSynced.args = {
  gState: "allGood",
  nState: { published: true, fileSynced: true },
  note: someNote,
  localFile: { path: "home/home.md", name: "Home" } as TFile,
};

export const PublishedNotSharing = Template.bind({});
PublishedNotSharing.args = {
  gState: "allGood",
  nState: { published: true, fileSynced: true },
  note: { ...someNote, sharing: {} },
  localFile: { path: "home/home.md", name: "Home" } as TFile,
};

export const PublishedSharingNoComments = Template.bind({});
PublishedSharingNoComments.args = {
  gState: "allGood",
  nState: { published: true, fileSynced: true },
  note: { ...someNote, comments: [] },
  localFile: { path: "home/home.md", name: "Home" } as TFile,
};

export const PublishedAndNotSynced = Template.bind({});
PublishedAndNotSynced.args = {
  gState: "allGood",
  nState: { published: true, fileSynced: false },
  note: someNote,
  localFile: { path: "home/home.md", name: "Home" } as TFile,
};

export const Publishing = Template.bind({});
Publishing.args = {
  gState: "allGood",
  note: null,
  nState: { publishing: true },
};

export const FetchingRemoteNote = Template.bind({});
FetchingRemoteNote.args = {
  gState: "allGood",
  nState: { fetching: true },
  note: null,
  localFile: { path: "home/home.md", name: "Home" } as TFile,
};

export const Updating = Template.bind({});
Updating.args = {
  gState: "allGood",
  nState: { published: true, updating: true },
  note: null,
  localFile: { path: "home/home.md", name: "Home" } as TFile,
};

export const NoLocalFile = Template.bind({});
NoLocalFile.args = {
  gState: "allGood",
  nState: { published: true },
  note: someNote,
  localFile: null,
};

export const Error = Template.bind({});
Error.args = {
  gState: "unknownError",
};
