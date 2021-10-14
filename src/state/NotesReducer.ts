import { ObjectId } from "bson";
import { Note } from "../domain/Note";

export type NotesState = {
  note: Note | undefined;
  notes: Array<Note> | undefined;
  hasMore: boolean;
  loading: boolean;
};

export const initialNotesState: NotesState = {
  note: undefined,
  notes: undefined,
  hasMore: false,
  loading: false,
};

export enum NotesActionKind {
  AppendNotes,
  ResetNotes,
  UpdateNote,
  RemoveNote,
  SetNote,
  SetLoading,
}

export type NotesAction = {
  type: NotesActionKind;
  payload: any;
};

export default function NotesReducer(state: NotesState, action: NotesAction): NotesState {
  const { type, payload } = action;

  switch (type) {
    case NotesActionKind.ResetNotes:
      return {
        ...state,
        notes: payload,
      };

    case NotesActionKind.AppendNotes:
      return {
        ...state,
        notes: state.notes ? [...state.notes].concat(payload.moreNotes) : payload.moreNotes,
        hasMore: payload.hasMore,
      };

    case NotesActionKind.UpdateNote:
      const updtNote = payload as Note;

      return {
        ...state,
        notes: state.notes ? state.notes.map((n) => (n._id.equals(updtNote._id) ? updtNote : n)) : [updtNote],
      };

    case NotesActionKind.SetNote:
      const currentNote = payload as Note;

      return {
        ...state,
        note: currentNote,
      };

    case NotesActionKind.RemoveNote:
      const noteId = payload as ObjectId;

      return {
        ...state,
        notes: state.notes?.filter((note) => !note._id.equals(noteId)),
      };

    case NotesActionKind.SetLoading:
      const isLoading = payload as boolean;

      return {
        ...state,
        loading: isLoading,
      };

    default:
      return state;
  }
}
