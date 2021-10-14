import { ObjectID } from "bson";
import { Note } from "../domain/Note";
import { People } from "../domain/People";
import { Group } from "@/domain/Group";

export default class NotesService {
  private static _instance: NotesService;
  constructor(private user: Realm.User, private subdomain: string) {
    NotesService._instance = this;
  }

  static get instance() {
    return NotesService._instance;
  }

  async getNote(noteId: string): Promise<Note | undefined> {
    return await this.user.functions.getNote(noteId);
  }

  notesColl() {
    return this.user.mongoClient("mongodb-atlas").db(this.subdomain).collection("notes");
  }

  async getNotes(oldest: number, limit: number): Promise<Note[]> {
    return await this.user.functions.userNotes(oldest, limit);
  }

  async hasMoreNotes(last: Note): Promise<number> {
    const atlasNotesColl = this.notesColl();
    if (atlasNotesColl) {
      const count = await atlasNotesColl.count({ created: { $lt: last.created } });
      return count;
    }
    return 0;
  }

  async removeSharingPeople(noteId: ObjectID, people: People) {
    const atlasNotesColl = this.notesColl();
    if (atlasNotesColl) {
      atlasNotesColl.updateOne({ _id: noteId }, { $pull: { "sharing.peoples": { $in: [people._id] } } });
    }
  }

  async removeSharingGroup(noteId: ObjectID, group: Group) {
    const atlasNotesColl = this.notesColl();
    if (atlasNotesColl) {
      atlasNotesColl.updateOne({ _id: noteId }, { $pull: { "sharing.groups": { $in: [group._id] } } });
    }
  }

  async addSharingPeople(noteId: ObjectID, people: People) {
    const atlasNotesColl = this.notesColl();
    if (atlasNotesColl) {
      atlasNotesColl.updateOne({ _id: noteId }, { $addToSet: { "sharing.peoples": people._id } });
    }
  }

  async addSharingGroup(noteId: ObjectID, group: Group) {
    const atlasNotesColl = this.notesColl();
    if (atlasNotesColl) {
      atlasNotesColl.updateOne({ _id: noteId }, { $addToSet: { "sharing.groups": group._id } });
    }
  }

  async deleteNote(noteId: ObjectID) {
    const atlasNotesColl = this.notesColl();
    if (atlasNotesColl) {
      atlasNotesColl.deleteOne({ _id: noteId });
    }
  }

  async removeComment(noteId: ObjectID, created: number, updated: number) {
    return await this.user.functions.removeComment(noteId, created, updated);
  }

  /**
   * NOTE: this function will have to be converted to a serverside function
   * to check the permissions
   * @param noteId
   * @param comment
   */
  async addNoteComment(noteId: ObjectID, comment: string, author: string) {
    return await this.user.functions.addComment(noteId, comment, author);
  }

  async editComment(noteId: ObjectID, comment: string, created: number, updated: number) {
    return await this.user.functions.editComment(noteId, comment, created, updated);
  }

  async getSharedNotes(people: string) {
    return await this.user.functions.sharedNotes(people);
  }

  async getSharingNotes(people: string) {
    return await this.user.functions.sharingNotes(people);
  }

  async getGroupNotes(groupId: string) {
    return await this.user.functions.groupNotes(groupId);
  }
}
