import { ObjectId, ObjectID } from "bson";
import { Group } from "./Group";
import { NoteComment } from "./NoteComment";
import { People } from "./People";

export interface Note {
  _id: ObjectID;
  created: number;
  updated: number;
  firstPublished: number;
  lastPublished: number;
  title: string;
  path: string;
  publicLink: ObjectID;
  content: string;
  userId: ObjectId;

  comments: NoteComment[];

  sharing: {
    peoples?: People[];
    groups?: Group[];
  };
}
