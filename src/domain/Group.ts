import ObjectID from "bson-objectid";
import { People } from "./People";

export interface Group {
  description: string;
  isPublic: boolean | undefined;
  _id: ObjectID;
  created: number | undefined;
  updated: number | undefined;
  name: string;
  peoples: People[];
  userId: ObjectID;
}

export type NewGroup = Omit<Group, "_id">;
