import { Note } from "../domain/Note";
import { People } from "../domain/People";
import { Group } from "@/domain/Group";
import { callFunction } from "@/services/ServiceUtils";
import ServerlessService from "@/services/ServerlessService";
import SekundPluginReact from "@/main";
import ObjectID from "bson-objectid";
import { isUnread } from "@/utils";

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
    const userNotes: Note[] = await callFunction(this.plugin, "userNotes", [oldest, limit]);
    if (userNotes && userNotes.length > 0) {
      return this.sortNotes(userNotes, false);
    }
    return [];
  }

  async hasMoreNotes(last: Note): Promise<number> {
    const atlasNotesColl = this.notesColl();
    if (atlasNotesColl) {
      const count = await atlasNotesColl.count({ created: { $lt: last.created } });
      return count;
    }
    return 0;
  }

  async addPublicLink(noteId: ObjectID) {
    return await callFunction(this.plugin, "addPublicLink", [noteId]);
  }

  async removePublicLink(noteId: ObjectID) {
    return await callFunction(this.plugin, "removePublicLink", [noteId]);
  }

  async removeSharingPeople(noteId: ObjectID, people: People) {
    return await callFunction(this.plugin, "removeSharingPeople", [noteId, people._id]);
  }

  async removeSharingGroup(noteId: ObjectID, group: Group) {
    return await callFunction(this.plugin, "removeSharingGroup", [noteId, group._id]);
  }

  async addSharingPeople(noteId: ObjectID, people: People) {
    return await callFunction(this.plugin, "addSharingPeople", [noteId, people._id]);
  }

  async addSharingGroup(noteId: ObjectID, group: Group) {
    return await callFunction(this.plugin, "addSharingGroup", [noteId, group._id]);
  }

  async setNoteIsRead(noteId: ObjectID) {
    return await callFunction(this.plugin, "setNoteIsRead", [noteId]);
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
  async addNoteComment(noteId: ObjectID, comment: string, author: string, created: number) {
    return await callFunction(this.plugin, "addComment", [noteId, comment, author, created]);
  }

  async editComment(noteId: ObjectID, comment: string, created: number, updated: number) {
    return await callFunction(this.plugin, "editComment", [noteId, comment, created, updated]);
  }

  async getAllSharedNotes() {
    const allSharedNotes: Note[] = await callFunction(this.plugin, "allSharedNotes");
    return this.sortNotes(allSharedNotes, false);
  }

  async getGroupNotes(groupId: string) {
    const notes = await callFunction(this.plugin, "groupNotes", [groupId]);
    return this.sortNotes(notes, true);
  }

  sortNotes(notes: Note[], group: boolean) {
    if (group) {
      return notes.sort((a, b) => (b.pinned ? b.updated + 1000000000 : b.updated) - (a.pinned ? a.updated + 1000000000 : a.updated));
    }
    return notes.sort((a, b) => b.updated - a.updated);
  }

  async getUnreadNotes() {
    return await callFunction(this.plugin, "unreadNotes");
  }
}
