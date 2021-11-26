import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { AppAction, AppActionKind, GeneralState, NoteState } from "@/state/AppReducer";
import ObjectID from "bson-objectid";
import { TFile } from "obsidian";
import React, { Dispatch } from "react";
import * as Realm from "realm-web";

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

export function setCurrentNoteState(
  dispatchers: Array<React.Dispatch<AppAction>>,
  nState: NoteState | null,
  local: TFile | undefined | null,
  remote: Note | undefined | null
) {
  dispatch(dispatchers, AppActionKind.SetCurrentNoteState, {
    noteState: nState,
    file: local,
    note: remote,
  });
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

export function originalPath(file: TFile): string {
  return file.path.startsWith("__sekund__") ? file.path.split("/").slice(2).join("/") : file.path;
}

export function makeid(length: number): string {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function hourMinSec(time: number) {
  const d = new Date(time);
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

export async function touch(appDispatch: Dispatch<AppAction>, note: Note) {
  if (isUnread(note)) {
    await NotesService.instance.setNoteIsRead(note._id);
    appDispatch({ type: AppActionKind.SetNoteIsRead, payload: note._id });
  }
}

export function isUnread(note: Note) {
  return note.isRead < note.updated;
}
