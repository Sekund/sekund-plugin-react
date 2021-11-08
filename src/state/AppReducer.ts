import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import SekundPluginReact from "@/main";
import GlobalState from "@/state/GlobalState";
import { TFile } from "obsidian";

export type GeneralState = "connecting" | "noApiKey" | "noSubdomain" | "noSettings" | "noSuchSubdomain" | "offline" | "allGood" | "unknownError" | "loginError";

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
};

export enum AppActionKind {
	SetCurrentNoteState,
	UpdateRemoteNote,
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
	switch (type) {
		case AppActionKind.SetCurrentNoteState:
			const { noteState, file, note } = payload;
			const result = {
				...state,
				currentNoteState: noteState,
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
		default:
			newState = state;
	}

	GlobalState.instance.appState = newState;
	return newState;
}
