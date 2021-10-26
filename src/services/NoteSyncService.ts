import { Note } from "@/domain/Note";
import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import { AppAction, AppActionKind, AppState } from "@/state/AppReducer";
import { dispatch, setCurrentNoteState } from "@/utils";
import { TFile } from "obsidian";

export default class NoteSyncService extends ServerlessService {
  private static _instance: NoteSyncService;
  public appState?: AppState;
  static get instance() {
    return NoteSyncService._instance;
  }

  constructor(plugin: SekundPluginReact, private dispatchers: React.Dispatch<AppAction>[]) {
    super(plugin);
    NoteSyncService._instance = this;
  }

  async renameNote({ name, path }: TFile) {
    if (this.appState) {
      const { remoteNote } = this.appState;
      if (remoteNote) {
        await callFunction(this.plugin, "renameNote", [remoteNote._id, name, path]);
      }
    }
  }

  async unpublish() {
    if (this.appState) {
      const { remoteNote } = this.appState;
      if (remoteNote) {
        await callFunction(this.plugin, "deleteNote", [remoteNote._id]);
        setCurrentNoteState(this.dispatchers, { published: false, fileSynced: false });
      }
    }
  }

  async compareNotes(file: TFile) {
    const { path, stat } = file;
    dispatch(this.dispatchers, AppActionKind.SetCurrentFile, file);
    setCurrentNoteState(this.dispatchers, { fetching: true, published: false });
    console.log("compare notes, getting note by path");
    const rNote = await this.getNoteByPath(file.path);
    dispatch(this.dispatchers, AppActionKind.SetRemoteNote, rNote);
    const fileSynced = rNote && rNote.updated === stat.mtime;
    setCurrentNoteState(this.dispatchers, { fileSynced, fetching: false, published: !!rNote });
  }

  async getNoteByPath(path: string): Promise<Note | undefined> {
    return await callFunction(this.plugin, "getNoteByPath", [path]);
  }

  async syncFile() {
    const file = this.appState?.currentFile;
    setCurrentNoteState(this.dispatchers, this.appState?.currentNoteState.published ? { publishing: true } : { synchronizing: true });
    if (file && this.appState && this.plugin.user) {
      const { remoteNote } = this.appState;
      await callFunction(this.plugin, "upsertNote", [
        {
          path: file.path,
          title: file.name,
          content: await file.vault.read(file),
          created: file.stat.ctime,
          updated: file.stat.mtime,
          firstPublished: remoteNote && remoteNote.firstPublished ? remoteNote.firstPublished : Date.now(),
          lastPublished: Date.now(),
        },
      ]);
      const rNote = await this.getNoteByPath(file.path);
      dispatch(this.dispatchers, AppActionKind.SetRemoteNote, rNote);
      setTimeout(() => {
        setCurrentNoteState(this.dispatchers, { publishing: false, published: true, fileSynced: true, synchronizing: false });
      }, 800);
    }
  }
}
