import { Note } from "@/domain/Note";
import { ContactRequestNotification, ContactRequestUpdate, NoteNotification, Notification, notificationTime } from "@/domain/Notification";
import { SharingPermission } from "@/domain/SharingPermission";

export type NotificationsState = {
  notifications: Notification[];
};

export enum UpdateKey {
  NOTE_ADD_COMMENT = "note.addComment",
  NOTE_RENAME = "note.rename",
  NOTE_METADATA_UPDATE = "note.metadataUpdate",
  NOTE_REMOVE_COMMENT = "note.removeComment",
  NOTE_EDIT_COMMENT = "note.editComment",
  NOTE_UPDATE = "updateNote",
  NOTE_DELETE = "note.delete",
  NOTE_UNREAD_CHANGED = "unreadChanged",
  GROUP_ADD = "group.add",
  GROUP_UPSERT = "group.upsert",
  GROUP_DELETE = "group.delete",
  PERMISSIONS_CHANGED = "permissions.changed",
  MODIFY_SHARING_GROUPS = "modifySharingGroups",
  MODIFY_SHARING_PEOPLE = "modifySharingPeoples",
  CONTACT_REQUEST = "contactRequest",
}

export const initialNotificationsState: NotificationsState = {
  notifications: [],
};

export enum NotificationActionKind {
  AddNotification,
  AddUpdate,
  RemoveNotification,
}

export type NotificationsAction = {
  type: NotificationActionKind;
  payload: any;
};

export function addNotification(state: NotificationsState, notification: Notification): Notification[] {
  const updtNotifications = [...state.notifications];
  updtNotifications.push(notification);
  updtNotifications.sort((a, b) => notificationTime(b) - notificationTime(a));
  return updtNotifications;
}

function upsertNoteNotification(notifications: Notification[], note: Note): NoteNotification {
  const noteNotification = notifications.find((n) => n.category === "note" && n.payload._id.equals(note._id)) as NoteNotification;
  if (noteNotification) {
    return noteNotification;
  } else {
    const notification: Notification = {
      category: "note",
      payload: note,
      details: null as any,
    };
    notifications.push(notification);
    return notification;
  }
}

function upsertContactRequestNotification(notifications: Notification[], sharingPermission: SharingPermission): ContactRequestNotification {
  const contactRequestNotification = notifications.find((n) => n.category === "contact" && n.payload._id.equals(note._id)) as ContactRequestNotification;
  if (contactRequestNotification) {
    return contactRequestNotification;
  } else {
    const notification: ContactRequestNotification = {
      category: "contact",
      details: {
        type: "request",
         payload: sharingPermission,
      } as ContactRequestUpdate,
    };
    notifications.push(notification);
    return notification;    
  }
}

export function reduceUpdate(updtNotifications: Notification[], payload: Note | SharingPermission, updateKey: UpdateKey): Notification[] {
  switch (updateKey) {
    case UpdateKey.NOTE_ADD_COMMENT:
      const noteNotification = upsertNoteNotification(updtNotifications, payload as Note);
      if (!noteNotification.details) {
        noteNotification.details = {
          type: updateKey,
          lastUpdate: payload.updated,
          by: [],
        };
        // filter only comments that were created / updated after this note was last read
        const { isRead: lastRead } = payload as Note;
        noteNotification.details.by = (payload as Note).comments
          .filter((nc) => nc.created > lastRead)
          .map((nc) => ({
            userName: nc.authorName || nc.authorEmail,
            userImage: nc.author.image,
            time: nc.created,
          }))
          .sort((a, b) => b.time - a.time);
      }
      break;
    case UpdateKey.CONTACT_REQUEST:
      upsertContactRequestNotification(updtNotifications, payload as SharingPermission);
      break;
    case UpdateKey.NOTE_RENAME:
      break;
    case UpdateKey.NOTE_METADATA_UPDATE:
      break;
    case UpdateKey.NOTE_DELETE:
      break;
    case UpdateKey.NOTE_UNREAD_CHANGED:
      break;
    case UpdateKey.NOTE_REMOVE_COMMENT:
      break;
    case UpdateKey.NOTE_EDIT_COMMENT:
      break;
    case UpdateKey.NOTE_UPDATE:
      break;
    case UpdateKey.GROUP_ADD:
      break;
    case UpdateKey.GROUP_UPSERT:
      break;
    case UpdateKey.GROUP_DELETE:
      break;
    case UpdateKey.MODIFY_SHARING_GROUPS:
      break;
    case UpdateKey.PERMISSIONS_CHANGED:
      break;
    case UpdateKey.MODIFY_SHARING_PEOPLE:
      break;
  }
  sortNotifications(updtNotifications);
  return updtNotifications;
}

export function sortNotifications(notifications: Notification[]) {
  notifications.sort((a, b) => {
    let aTime = notificationTime(a);
    let bTime = notificationTime(b);
    if (a.category === "contact") {
      aTime = aTime + (60 * 60 * 24 * 365 * 1000);
    }
    if (b.category === "contact") {
      bTime = bTime + (60 * 60 * 24 * 365 * 1000);
    }
    return (bTime - aTime)
  });
}

export default function UpdatesReducer(state: NotificationsState, action: NotificationsAction): NotificationsState {
  const { type, payload } = action;

  switch (type) {
    case NotificationActionKind.AddNotification:
      const notifications = addNotification(state, payload);
      return { ...state, notifications };
    case NotificationActionKind.RemoveNotification:
      return { ...state, notifications: state.notifications.filter((u) => notificationTime(u) !== notificationTime(payload)) };
    case NotificationActionKind.AddUpdate:
      const updtNotifications = reduceUpdate([...state.notifications], payload.payload, payload.type);
      return { ...state, notifications: updtNotifications };
    default:
      return state;
  }
}
