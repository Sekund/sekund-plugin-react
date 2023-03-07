import { Note } from "@/domain/Note";
import { SharingPermission } from "@/domain/SharingPermission";

export type UpdatesState = {
  updates: Update[];
};

export type Update = {
  type: "note" | "permissionRequest" | "permissionGranted";
  id: string;
  data: Note | SharingPermission;
  time: number;
};

export const initialUpdatesState: UpdatesState = {
  updates: [],
};

export enum UpdatesActionKind {
  AddUpdate,
  RemoveUpdate,
}

export type UpdatesAction = {
  type: UpdatesActionKind;
  update: Update;
};

export function addUpdate(state: UpdatesState, update: Update): Update[] {
  const updtUpdates = [...state.updates];
  updtUpdates.push(update);
  updtUpdates.sort((a, b) => b.time - a.time);
  return updtUpdates;
}

export default function CommentReducer(state: UpdatesState, action: UpdatesAction): UpdatesState {
  const { type, update } = action;

  switch (type) {
    case UpdatesActionKind.AddUpdate:
      const updates = addUpdate(state, update);
      return { ...state, updates };
    case UpdatesActionKind.RemoveUpdate:
      return { ...state, updates: state.updates.filter((u) => u.id !== update.id) };

    default:
      return state;
  }
}
