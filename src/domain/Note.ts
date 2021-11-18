import ObjectID from "bson-objectid";
import { Group } from "./Group";
import { NoteComment } from "./NoteComment";
import PathInfo from "./PathInfo";
import { People } from "./People";

export interface Note {
	_id: ObjectID;
	created: number;
	updated: number;
	firstPublished: number;
	lastPublished: number;
	title: string;
	path: string;
	content: string;
	userId: ObjectID;
	assets: Array<string>;
	isRead: number;
	readCount: number;
	backlinksCount: number;

	comments: NoteComment[];

	sharing: {
		peoples?: People[];
		groups?: Group[];
	};
}

export function isSharing(note: Note): boolean {
	return note.sharing!! && ((note.sharing.peoples!! && note.sharing.peoples.length > 0) || (note.sharing.groups!! && note.sharing.groups.length > 0));
}
