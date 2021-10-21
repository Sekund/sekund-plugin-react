import { Note } from "@/domain/Note";
import { AppContextType } from "@/state/AppContext";
import { AppActionKind, GeneralState, initialAppState, NoteState } from "@/state/AppReducer";
import ObjectID from "bson-objectid";
import React from "react";

export default class GeneralStateWrapper extends React.Component {
  private gState: GeneralState;
  private nState: Partial<NoteState>;
  private locale: string;
  private note: Note;

  constructor(gState: GeneralState, nState: Partial<NoteState>, note: Note, locale: string) {
    super({});
    this.gState = gState;
    this.locale = locale;
    this.nState = nState;
    this.note = note;
  }

  addAppDispatch(appContext: AppContextType) {
    if (appContext.appState.generalState !== this.gState) {
      appContext.appDispatch({ type: AppActionKind.SetGeneralState, payload: this.gState });
    }
    if (appContext.appState.subdomain !== "tailwind") {
      appContext.appDispatch({ type: AppActionKind.SetSubdomain, payload: "tailwind" });
    }
    if (appContext.appState.locale !== this.locale) {
      appContext.appDispatch({ type: AppActionKind.SetLocale, payload: this.locale });
    }
    if (appContext.appState.plugin === undefined) {
      appContext.appDispatch({ type: AppActionKind.SetPlugin, payload: { saveSettings: () => {}, settings: { apiKey: "888555222777AAABBB", subdomain: "tailwind" } } });
    }
    if (this.nState && this.noteStateDiffers(this.nState, appContext.appState.currentNoteState)) {
      appContext.appDispatch({ type: AppActionKind.SetCurrentNoteState, payload: this.nState });
    }
    if (this.note && this.remoteNotesDiffer(this.note, appContext.appState.remoteNote)) {
      appContext.appDispatch({ type: AppActionKind.SetRemoteNote, payload: this.note });
    }
    if (!appContext.appState.userProfile) {
      appContext.appDispatch({ type: AppActionKind.SetUserProfile, payload: { _id: new ObjectID(), image: "/avatars/1.jpeg", name: "Candide Kemmler", email: "hi@sekund.io" } });
    }
  }

  remoteNotesDiffer(note: Note, remoteNote: Note) {
    if ((note && !remoteNote) || (remoteNote && !note)) {
      return true;
    }
    return JSON.stringify(note) !== JSON.stringify(remoteNote);
  }

  noteStateDiffers(nState: Partial<NoteState>, currentNoteState: NoteState): boolean {
    if (nState.published !== undefined && nState.published !== currentNoteState.published) return true;
    if (nState.publishing !== undefined && nState.publishing !== currentNoteState.publishing) return true;
    if (nState.fileSynced !== undefined && nState.fileSynced !== currentNoteState.fileSynced) return true;
    if (nState.fetching !== undefined && nState.fetching !== currentNoteState.fetching) return true;
    if (nState.synchronizing !== undefined && nState.synchronizing !== currentNoteState.synchronizing) return true;
    return false;
  }
}
