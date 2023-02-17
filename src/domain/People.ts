import { Note } from "@/domain/Note";
import ObjectID from "bson-objectid";

export type PeopleId = Pick<People, "name" | "image" | "email" | "_id" | "bio">;

export interface People {
  _id: ObjectID;
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  name?: string;
  image?: string;
  bio?: string;
  twitterHandle?: string;
  linkedInPage?: string;
  personalPage?: string;
  sharing?: number;
  shared?: number;
  sharingNotes?: Note[];
  sharedNotes?: Note[];
  unreadSharing?: number;
  unreadShared?: number;
  consentedToTrackBehaviouralDataInOrderToImproveTheProduct?: boolean;
}
