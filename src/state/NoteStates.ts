import { NoteState } from "@/state/AppReducer";

export const NO_LOCAL_FILE: NoteState = { fileSynced: false, publishing: false, fetching: false, updating: false, exists: false };

export const OWN_NOTE_LOCAL: NoteState = { fileSynced: false, publishing: false, fetching: false, updating: false, exists: true };

export const OWN_NOTE_FETCHING: NoteState = { fileSynced: false, publishing: false, fetching: true, updating: false, exists: true };

export const OWN_NOTE_UPTODATE: NoteState = { fileSynced: true, publishing: false, fetching: false, updating: false, exists: true };

export const OWN_NOTE_OUTDATED: NoteState = { fileSynced: false, publishing: false, fetching: false, updating: false, exists: true };

export const OWN_NOTE_SYNCHRONIZING: NoteState = { fileSynced: false, publishing: false, fetching: false, updating: true, exists: true };

export const SHARED_NOTE_UPTODATE: NoteState = { fileSynced: true, publishing: false, fetching: false, updating: false, exists: true };

export const SHARED_NOTE_SYNCHRONIZING: NoteState = { fileSynced: false, publishing: false, fetching: false, updating: true, exists: true };
