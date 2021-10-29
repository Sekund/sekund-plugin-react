import { Note } from "../domain/Note";
import { People } from "../domain/People";
import { Group } from "@/domain/Group";
import { callFunction } from "@/services/ServiceUtils";
import ServerlessService from "@/services/ServerlessService";
import SekundPluginReact from "@/main";
import ObjectID from "bson-objectid";

export default class NotesService extends ServerlessService {
  private static _instance: NotesService;
  constructor(plugin: SekundPluginReact) {
    super(plugin);
    NotesService._instance = this;
  }

  static get instance() {
    return NotesService._instance;
  }

  async getNote(noteId: string): Promise<Note | undefined> {
    return await callFunction(this.plugin, "getNote", [noteId]);
  }

  notesColl() {
    return this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.subdomain).collection("notes");
  }

  async getNotes(oldest: number, limit: number): Promise<Note[]> {
    return await callFunction(this.plugin, "userNotes", [oldest, limit]);
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
    return await callFunction(this.plugin, "removeComment", [noteId, created, updated]);
  }

  /**
   * NOTE: this function will have to be converted to a serverside function
   * to check the permissions
   * @param noteId
   * @param comment
   */
  async addNoteComment(noteId: ObjectID, comment: string, author: string) {
    return await callFunction(this.plugin, "addComment", [noteId, comment, author]);
  }

  async editComment(noteId: ObjectID, comment: string, created: number, updated: number) {
    return await callFunction(this.plugin, "editComment", [noteId, comment, created, updated]);
  }

  async getSharedNotes(people: string) {
    return await callFunction(this.plugin, "sharedNotes", [people]);
  }

  async getSharingNotes(people: string) {
    return await callFunction(this.plugin, "sharingNotes", [people]);
  }

  async getGroupNotes(groupId: string) {
    return await callFunction(this.plugin, "groupNotes", [groupId]);
  }
}
