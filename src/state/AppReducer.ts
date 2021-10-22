import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import SekundPluginReact from "@/main";
import { Plugin_2, TFile } from "obsidian";

export type GeneralState = "connecting" | "noApiKey" | "noSubdomain" | "noSettings" | "noSuchSubdomain" | "offline" | "allGood" | "unknownError" | "loginError";

export type NoteState = {
  published: boolean; // exists in Sekund
  fileSynced: boolean; // exists and synched
  publishing: boolean;
  fetching: boolean;
  synchronizing: boolean;
};

export type AppState = {
  generalState: GeneralState;
  currentNoteState: NoteState;
  remoteNote: Note;
  subdomain: string;
  currentFile: TFile;
  locale: string;
  plugin: SekundPluginReact;
  userProfile: People;
  event: any;
};

export const initialAppState: AppState = {
  generalState: "connecting",
  remoteNote: undefined,
  currentNoteState: {
    published: false,
    fileSynced: false,
    publishing: false,
    fetching: false,
    synchronizing: false,
  },
  subdomain: "",
  locale: "en",
  currentFile: undefined,
  plugin: undefined,
  userProfile: undefined,
  event: undefined,
};

export enum AppActionKind {
  SetCurrentNoteState,
  SetRemoteNote,
  SetCurrentFile,
  SetLocale,
  SetGeneralState,
  SetSubdomain,
  SetUserProfile,
  SetPlugin,
  SetEvent,
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
      const result = { ...state, currentNoteState: Object.assign({}, state.currentNoteState, noteFlags) };
      return result;
    case AppActionKind.SetGeneralState:
      return { ...state, generalState: payload };
    case AppActionKind.SetSubdomain:
      return { ...state, subdomain: payload };
    case AppActionKind.SetRemoteNote:
      return { ...state, remoteNote: payload };
    case AppActionKind.SetCurrentFile:
      return { ...state, currentFile: payload };
    case AppActionKind.SetLocale:
      return { ...state, locale: payload };
    case AppActionKind.SetPlugin:
      return { ...state, plugin: payload };
    case AppActionKind.SetUserProfile:
      return { ...state, userProfile: payload };
    case AppActionKind.SetEvent:
      return { ...state, event: payload };

    default:
      return state;
  }
}
