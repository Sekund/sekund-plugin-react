import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import ObjectID from "bson-objectid";

export type PermissionRequestStatus = "requested" | "accepted" | "rejected" | "blocked";

/*
if user requests contact, then userId is the user requesting contact
*/
export interface SharingPermission {
  _id: ObjectID;
  user?: People; // user requesting contact
  group?: Group;
  status: PermissionRequestStatus;
  created: number;
  updated: number;
  userId: ObjectID; // target user ID
  userInfo: People; // target user info
}
