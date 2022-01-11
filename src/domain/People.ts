import ObjectID from "bson-objectid";

export type PeopleId = Pick<People, "name" | "image" | "email" | "_id">;

export interface People {
  _id: ObjectID;
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  name?: string;
  image?: string;
  bio?: string;
  sharing?: number;
  shared?: number;
  unreadSharing?: number;
  unreadShared?: number;
}
