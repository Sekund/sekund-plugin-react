/**
 * A wrapper that groups Updates of the same type and
 * adds a timestamp for the last update.
 */

import { Note } from "@/domain/Note";
import { SharingPermission } from "@/domain/SharingPermission";
import { UpdateKey } from "@/state/NotificationsReducer";

export type Notification = ContactRequestNotification | NoteNotification;

export function notificationTime(notification: Notification): number {
  if (notification.category === "contact") {
    return notification.details.payload.updated;
  } else if (notification.category === "note") {
    if (notification.details.type === UpdateKey.MODIFY_SHARING_GROUPS || notification.details.type === UpdateKey.MODIFY_SHARING_PEOPLE) {
      return notification.details.time;
    } else if (notification.details.type === "unshared") {
      return notification.details.time;
    } else if (notification.details.type === UpdateKey.NOTE_UPDATE) {
      return notification.details.time;
    } else if (notification.details.type === UpdateKey.NOTE_DELETE) {
      return notification.details.time;
    } else if (notification.details.type === UpdateKey.NOTE_ADD_COMMENT) {
      return notification.details.lastUpdate;
    } else if (notification.details.type === "viewed") {
      return notification.details.lastUpdate;
    } else {
      return 0;
    }
  }
  return 0;
}

export type ContactRequestNotification = {
  category: "contact";
  details: ContactRequestUpdate;
};

export type ContactRequestUpdate = {
  type: "request";
  payload: SharingPermission;
};

export type NoteNotification = {
  payload: Note;
  category: "note";
  details: NoteCommentedUpdate | NoteViewedUpdate | NoteSharedUpdate | NoteUpdatedUpdate | NoteDeletedUpdate | NoteUnsharedUpdate;
};

export interface NoteCommentedUpdate {
  type: UpdateKey.NOTE_ADD_COMMENT;
  lastUpdate: number;
  by: Array<{ userName: string; userImage?: string; time: number }>;
}

export type NoteViewedUpdate = {
  type: "viewed";
  lastUpdate: number;
  by: Array<{ userName: string; userImage: string; time: number }>;
};

export type NoteSharedUpdate = {
  type: UpdateKey.MODIFY_SHARING_PEOPLE | UpdateKey.MODIFY_SHARING_GROUPS;
  time: number;
};

export type NoteUpdatedUpdate = {
  type: UpdateKey.NOTE_UPDATE;
  time: number;
};

export type NoteDeletedUpdate = {
  type: UpdateKey.NOTE_DELETE;
  time: number;
};

export type NoteUnsharedUpdate = {
  type: "unshared";
  time: number;
};
