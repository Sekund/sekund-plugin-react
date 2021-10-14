import { App, TFile } from "obsidian";
import { Note } from "src/domain/Note";

export type GeneralState = "connecting" | "noApiKey" | "noSubdomain" | "noSettings" | "noSuchSubdomain" | "offline" | "allGood" | "unknownError" | "loginError";

export type NoteState = {
  published: boolean; // exists in Sekund
  fileSynced: boolean; // exists and synched
  publishing: boolean;
  comparing: boolean;
};

export type AppState = {
  generalState: GeneralState;
  currentNoteState: NoteState;
  remoteNote: Note;
  subdomain: string;
  currentFile: TFile;
};

export const initialAppState: AppState = {
  generalState: "connecting",
  remoteNote: undefined,
  currentNoteState: {
    published: false,
    fileSynced: false,
    publishing: false,
    comparing: false,
  },
  subdomain: "",
  currentFile: undefined,
};

export enum AppActionKind {
  SetCurrentNoteState,
  SetRemoteNote,
  SetCurrentFile,
  SetGeneralState,
  SetSubdomain,
}

export type AppAction = {
  type: AppActionKind;
  payload: any;
};

export default function AppReducer(state: AppState, action: AppAction): AppState {
  const { type, payload } = action;

  switch (type) {
    case AppActionKind.SetCurrentNoteState:
      const noteFlags: Partial<NoteState> = payload as Partial<NoteState>;
      return { ...state, currentNoteState: { ...state.currentNoteState, ...noteFlags } };
    case AppActionKind.SetGeneralState:
      return { ...state, generalState: payload };
    case AppActionKind.SetSubdomain:
      return { ...state, subdomain: payload };
    case AppActionKind.SetRemoteNote:
      return { ...state, remoteNote: payload };
    case AppActionKind.SetCurrentFile:
      return { ...state, currentFile: payload };

    default:
      return state;
  }
}
