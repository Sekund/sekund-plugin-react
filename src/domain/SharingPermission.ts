import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import ObjectID from "bson-objectid";

export type PermissionRequestStatus = "requested" | "accepted" | "rejected" | "blocked";

export interface SharingPermission {
  _id: ObjectID;
  user?: People;
  group?: Group;
  status: PermissionRequestStatus;
  created: number;
  updated: number;
}
