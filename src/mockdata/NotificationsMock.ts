import { SharingPermission } from "@/domain/SharingPermission";
import { someNote } from "./NotesMock";
import { Notification } from "@/domain/Notification";
import ObjectID from "bson-objectid";
import peoples from "@/mockdata/PeoplesMock";

const now = Date.now();

const me = peoples[0];
const incoming1 = peoples[1];

const noteViewedNotification = {
  payload: someNote,
  category: "note",
  details: {
    type: "viewed",
    lastUpdate: now,
  },
} as Notification;

const contactRequestNotification = {
  category: "contact",
  details: {
    type: "request",
    payload: {
      _id: new ObjectID(),
      userId: me._id, // target user id
      userInfo: me, // target user info
      user: incoming1, // requesting user info
      created: now,
      updated: now,
      status: "requested",
    } as SharingPermission,
  },
} as Notification;

export { noteViewedNotification, contactRequestNotification };
