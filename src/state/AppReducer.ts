import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import SekundPluginReact from "@/main";
import GlobalState from "@/state/GlobalState";
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
  remoteNote: Note | undefined;
  currentFile: TFile | undefined;
  locale: string;
  plugin: SekundPluginReact | undefined;
  userProfile: People | undefined;
  event: any;
};

export const initialAppState: AppState = {
  generalState: "offline",
  remoteNote: undefined,
  currentNoteState: {
    published: false,
    fileSynced: false,
    publishing: false,
    fetching: false,
    synchronizing: false,
  },
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

  let newState: AppState;
  const trace = new Error().stack;
  switch (type) {
    case AppActionKind.SetCurrentNoteState:
      const noteFlags: Partial<NoteState> = payload as Partial<NoteState>;
      const result = { ...state, currentNoteState: Object.assign({}, state.currentNoteState, noteFlags) };
      newState = result;
      break;
    case AppActionKind.SetGeneralState:
      newState = { ...state, generalState: payload };
      break;
    case AppActionKind.SetRemoteNote:
      newState = { ...state, remoteNote: payload };
      break;
    case AppActionKind.SetCurrentFile:
      newState = { ...state, currentFile: payload };
      break;
    case AppActionKind.SetLocale:
      newState = { ...state, locale: payload };
      break;
    case AppActionKind.SetPlugin:
      newState = { ...state, plugin: payload };
      break;
    case AppActionKind.SetUserProfile:
      newState = { ...state, userProfile: payload };
      break;
    default:
      newState = state;
  }

  GlobalState.instance.appState = newState;
  return newState;
}
