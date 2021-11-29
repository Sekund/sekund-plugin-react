import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import { NoteSummary } from "@/domain/Types";
import SekundPluginReact from "@/main";
import GlobalState from "@/state/GlobalState";
import ObjectID from "bson-objectid";
import { TFile } from "obsidian";

export type GeneralState =
  | "connecting"
  | "noApiKey"
  | "noSubdomain"
  | "noSettings"
  | "noSuchSubdomain"
  | "offline"
  | "allGood"
  | "unknownError"
  | "loginError";

export type UnreadNotes = {
  home: Note[];
  peoples: Note[];
  groups: Note[];
  all: Note[];
};

export type NoteState = {
  fileSynced: boolean;
  publishing: boolean;
  fetching: boolean;
  updating: boolean;
  isShared: boolean;
};

export type AppState = {
  generalState: GeneralState;
  currentNoteState: NoteState;
  remoteNote: Note | undefined;
  currentFile: TFile | undefined;
  locale: string;
  plugin: SekundPluginReact | undefined;
  userProfile: People;
  event: any;
  unreadNotes: UnreadNotes;
  noteUpdates: NoteSummary | undefined;
};

export const initialAppState: AppState = {
  generalState: "offline",
  remoteNote: undefined,
  currentNoteState: {
    fileSynced: false,
    publishing: false,
    fetching: false,
    updating: false,
    isShared: false,
  },
  locale: "en",
  currentFile: undefined,
  plugin: undefined,
  userProfile: {} as People,
  event: undefined,
  unreadNotes: { home: [], peoples: [], groups: [], all: [] },
  noteUpdates: undefined,
};

export enum AppActionKind {
  SetCurrentNoteState,
  UpdateRemoteNote,
  SetLocale,
  SetGeneralState,
  SetUserProfile,
  SetPlugin,
  SetEvent,
  SetUnreadNotes,
  SetNoteIsRead,
  SetNoteUpdates,
}

export type AppAction = {
  type: AppActionKind;
  payload: any;
};

export default function AppReducer(state: AppState, action: AppAction): AppState {
  const { type, payload } = action;

  let newState: AppState;
  switch (type) {
    case AppActionKind.SetCurrentNoteState:
      const { noteState, file, note } = payload;
      const result = {
        ...state,
        currentNoteState: noteState === undefined ? state.currentNoteState : noteState,
        currentFile: file === undefined ? state.currentFile : file,
        remoteNote: note === undefined ? state.remoteNote : note,
      };
      newState = result;
      break;
    case AppActionKind.SetGeneralState:
      newState = { ...state, generalState: payload };
      break;
    case AppActionKind.UpdateRemoteNote:
      newState = { ...state, remoteNote: payload };
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
    case AppActionKind.SetUnreadNotes:
      newState = { ...state, unreadNotes: payload };
      break;
    case AppActionKind.SetNoteIsRead:
      const unreadNotes = { ...state.unreadNotes };
      filterNoteOutOfUnreadNotes(unreadNotes, payload);
      newState = { ...state, unreadNotes };
      break;
    case AppActionKind.SetNoteUpdates:
      newState = { ...state, noteUpdates: state.noteUpdates ? { ...state.noteUpdates, ...payload } : payload };
      break;
    default:
      newState = state;
  }

  GlobalState.instance.appState = newState;
  return newState;
}

export function filterNoteOutOfUnreadNotes(unreadNotes: UnreadNotes, noteId: ObjectID) {
  unreadNotes.home = unreadNotes.home.filter((n) => !n._id.equals(noteId));
  unreadNotes.peoples = unreadNotes.peoples.filter((n) => !n._id.equals(noteId));
  unreadNotes.groups = unreadNotes.groups.filter((n) => !n._id.equals(noteId));
  unreadNotes.all = unreadNotes.all.filter((n) => !n._id.equals(noteId));
  return unreadNotes;
}
