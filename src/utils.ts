import * as Realm from "realm-web";
import { AppAction, AppActionKind, GeneralState, NoteState } from "@/state/AppReducer";
import React from "react";

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
}

export function setCurrentNoteState(dispatchers: Array<React.Dispatch<AppAction>>, nState: Partial<NoteState>) {
  dispatchers.forEach((appDispatch) => appDispatch({ type: AppActionKind.SetCurrentNoteState, payload: nState }));
}

export function isObjectEmpty(object: Record<string, unknown>): boolean {
  for (const property in object) {
    // if any enumerable property is found object is not empty
    return false;
  }

  return true;
}

export type Constructor<T = {}> = new (...args: any[]) => T;
