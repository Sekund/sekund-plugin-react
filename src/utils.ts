import * as Realm from "realm-web";
import { AppAction, AppActionKind, GeneralState, NoteState } from "@/state/AppReducer";
import React from "react";
import GlobalState from "@/state/GlobalState";
import { TFile } from "obsidian";
import { Note } from "@/domain/Note";

export async function getApiKeyConnection(realmApp: Realm.App, apiKey: string): Promise<Realm.User | null> {
	const credentials = Realm.Credentials.apiKey(apiKey);
	try {
		return await realmApp.logIn(credentials);
	} catch (err) {
		return null;
	}
}

export function dispatch(dispatchers: Array<React.Dispatch<AppAction>>, type: AppActionKind, payload: any) {
	dispatchers.forEach((appDispatch) => appDispatch({ type, payload }));
}

export function setGeneralState(dispatchers: Array<React.Dispatch<AppAction>>, gState: GeneralState) {
	dispatchers.forEach((appDispatch) => appDispatch({ type: AppActionKind.SetGeneralState, payload: gState }));
	// we are setting the global state's generalState here so that contexts
	// that are not yet created will be initialized with the mutated state at
	// that stage – we might already be connecting/connected when another
	// component gets created.
	GlobalState.instance.appState.generalState = gState;
}

export function setCurrentNoteState(dispatchers: Array<React.Dispatch<AppAction>>, nState: NoteState | null, local: TFile | undefined | null, remote: Note | undefined | null) {
	dispatchers.forEach((appDispatch) =>
		appDispatch({
			type: AppActionKind.SetCurrentNoteState,
			payload: {
				noteState: nState,
				file: local,
				note: remote,
			},
		})
	);
}

export function isObjectEmpty(object: Record<string, unknown>): boolean {
	for (const property in object) {
		// if any enumerable property is found object is not empty
		return false;
	}

	return true;
}

export function cssProp(name: string) {
	return getComputedStyle(document.body).getPropertyValue(name);
}

export type Constructor<T = {}> = new (...args: any[]) => T;

export function isSharedNoteFile(file: TFile): boolean {
	return file.path.startsWith("__sekund__");
}
