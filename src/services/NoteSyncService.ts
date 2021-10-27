import { Note } from "@/domain/Note";
import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import { AppAction, AppActionKind, AppState } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import { dispatch, setCurrentNoteState } from "@/utils";
import { TFile } from "obsidian";

export default class NoteSyncService extends ServerlessService {
  private static _instance: NoteSyncService;
  static get instance() {
    return NoteSyncService._instance;
  }

  constructor(plugin: SekundPluginReact, private dispatchers: React.Dispatch<AppAction>[]) {
    super(plugin);
    NoteSyncService._instance = this;
  }

  async renameNote({ name, path }: TFile) {
    const { remoteNote } = GlobalState.instance.appState;
    if (remoteNote) {
      await callFunction(this.plugin, "renameNote", [remoteNote._id, name, path]);
    }
  }

  async unpublish() {
    const { remoteNote } = GlobalState.instance.appState;
    if (remoteNote) {
      await callFunction(this.plugin, "deleteNote", [remoteNote._id]);
      setCurrentNoteState(this.dispatchers, { published: false, fileSynced: false });
    }
  }

  async noFile(note: Note) {
    console.log("noFile: " + note?.title);
    dispatch(this.dispatchers, AppActionKind.SetRemoteNote, note);
    dispatch(this.dispatchers, AppActionKind.SetCurrentFile, undefined);
  }

  async compareNotes(file: TFile) {
    const { path, stat } = file;
    dispatch(this.dispatchers, AppActionKind.SetCurrentFile, file);
    setCurrentNoteState(this.dispatchers, { fetching: true, published: false });
    const rNote = await this.getNoteByPath(file.path);
    console.log("comparing notes, remote note is " + rNote?.title);
    dispatch(this.dispatchers, AppActionKind.SetRemoteNote, rNote);
    const fileSynced = rNote && rNote.updated === stat.mtime;
    setCurrentNoteState(this.dispatchers, { fileSynced, fetching: false, published: !!rNote });
  }

  async getNoteByPath(path: string): Promise<Note | undefined> {
    console.log("getting note at path", path);
    return await callFunction(this.plugin, "getNoteByPath", [path]);
  }

  async syncFile() {
    const file = GlobalState.instance.appState.currentFile;
    setCurrentNoteState(this.dispatchers, GlobalState.instance.appState.currentNoteState.published ? { publishing: true } : { synchronizing: true });
    if (file && GlobalState.instance.appState && this.plugin.user) {
      const { remoteNote } = GlobalState.instance.appState;
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
      console.log("syncFile, rNote is " + rNote?.title);
      dispatch(this.dispatchers, AppActionKind.SetRemoteNote, rNote);
      setTimeout(() => {
        setCurrentNoteState(this.dispatchers, { publishing: false, published: true, fileSynced: true, synchronizing: false });
      }, 800);
    }
  }
}
