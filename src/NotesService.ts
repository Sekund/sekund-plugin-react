import { TFile } from "obsidian";
import * as Realm from "realm-web";
import { AppAction, AppActionKind, AppState } from "src/state/AppReducer";
import { getApiKeyConnection, setCurrentNoteState } from "src/utils";

export default class NotesService {
  private static _instance: NotesService;
  public appState: AppState;
  static get instance() {
    return NotesService._instance;
  }

  user: Realm.User = null;

  constructor(private appId: string, private apiKey: string, private subdomain: string, private appDispatch: React.Dispatch<AppAction>) {
    NotesService._instance = this;
  }

  async connect() {
    this.user = await getApiKeyConnection(new Realm.App(this.appId), this.apiKey);
  }

  getNotes() {
    return this.user
      .mongoClient("mongodb-atlas")
      .db(this.subdomain === "development" ? "sekund" : this.subdomain)
      .collection("notes");
  }

  async renameNote({ name, path }: TFile) {
    const { remoteNote } = this.appState;
    await this.getNotes().updateOne({ _id: remoteNote._id }, { $set: { title: name, path } });
  }

  async unpublish() {
    const { remoteNote } = this.appState;
    await this.getNotes().deleteOne({ _id: remoteNote._id });
    setCurrentNoteState(this.appDispatch, { published: false, fileSynced: false });
  }

  async compareNotes(file: TFile) {
    const { path, stat } = file;
    this.appDispatch({ type: AppActionKind.SetCurrentFile, payload: file });
    setCurrentNoteState(this.appDispatch, { comparing: true, published: false });
    const noteInfo = await this.getNotes().findOne({ path });
    this.appDispatch({ type: AppActionKind.SetRemoteNote, payload: noteInfo });
    const fileSynced = noteInfo && noteInfo.updated === stat.mtime;
    setCurrentNoteState(this.appDispatch, { fileSynced, comparing: false, published: noteInfo !== null });
    return noteInfo;
  }

  async syncFile() {
    const file = this.appState.currentFile;
    console.log("current file is ", file);
    setCurrentNoteState(this.appDispatch, { publishing: true });
    const { remoteNote } = this.appState;
    await this.user.functions.upsertNote({
      path: file.path,
      title: file.name,
      content: await file.vault.read(file),
      created: file.stat.ctime,
      updated: file.stat.mtime,
      firstPublished: remoteNote && remoteNote.firstPublished ? remoteNote.firstPublished : Date.now(),
      lastPublished: Date.now(),
    });
    const rNote = await this.getNotes().findOne({ path: file.path });
    this.appDispatch({ type: AppActionKind.SetRemoteNote, payload: rNote });
    setTimeout(() => {
      setCurrentNoteState(this.appDispatch, { publishing: false, published: true, fileSynced: true });
    }, 800);
  }
}
