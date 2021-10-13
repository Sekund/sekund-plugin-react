import { PeopleId } from "./People";

export interface NoteComment {
  text: string;
  author: PeopleId;
  created: number;
  updated: number;
}
