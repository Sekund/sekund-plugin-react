import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { AppAction, AppActionKind, GeneralState, NoteState } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import { TFile, TFolder } from "obsidian";
import React, { Dispatch } from "react";
import * as Realm from "realm-web";

export async function getApiKeyConnection(realmApp: Realm.App, apiKey: string): Promise<Realm.User | null> {
  try {
    return await realmApp.logIn(Realm.Credentials.apiKey(apiKey));
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
  nState: NoteState | undefined | null,
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
  return file.path.startsWith(GlobalState.instance.appState.plugin?.settings.sekundFolderPath || "__sekund__");
}

export function originalPath(file: TFile): string {
  const sekundFolderPath = GlobalState.instance.appState.plugin?.settings.sekundFolderPath || "__sekund__";
  return file.path.startsWith(sekundFolderPath) ? file.path.split("/").slice(2).join("/") : file.path;
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
  if (!note.isRead) {
    return false;
  }
  return note.isRead < note.updated;
}

export async function wait(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export function capitalize(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
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

export function hashCode(str: string) {
  var hash = 0,
    i = 0,
    len = str.length;
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
  }
  return hash;
}

export function copyToClipboard(data: string): void {
  const listener = (e: ClipboardEvent) => {
    e.clipboardData!.setData("text/plain", data);
    e.preventDefault();
    document.removeEventListener("copy", listener);
  };
  document.addEventListener("copy", listener);
  document.execCommand("copy");
}

export function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}
