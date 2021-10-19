import { AppContextType } from "@/state/AppContext";
import { AppActionKind, GeneralState, initialAppState, NoteState } from "@/state/AppReducer";
import React from "react";

export default class GeneralStateWrapper extends React.Component {
  private gState: GeneralState;
  private nState: Partial<NoteState>;
  private locale: string;

  constructor(gState: GeneralState, nState: Partial<NoteState>, locale: string) {
    super({});
    this.gState = gState;
    this.locale = locale;
    this.nState = nState;
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
  }

  noteStateDiffers(nState: Partial<NoteState>, currentNoteState: NoteState): boolean {
    if (nState.published !== undefined && nState.published !== currentNoteState.published) return true;
    if (nState.publishing !== undefined && nState.publishing !== currentNoteState.publishing) return true;
    if (nState.fileSynced !== undefined && nState.fileSynced !== currentNoteState.fileSynced) return true;
    if (nState.comparing !== undefined && nState.comparing !== currentNoteState.comparing) return true;
    return false;
  }
}
