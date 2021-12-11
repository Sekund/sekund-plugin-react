import { Note } from "@/domain/Note";
import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import GlobalState from "@/state/GlobalState";
import {
  OWN_NOTE_FETCHING,
  OWN_NOTE_LOCAL,
  OWN_NOTE_OUTDATED,
  OWN_NOTE_SYNCHRONIZING,
  OWN_NOTE_UPTODATE,
  SHARED_NOTE_SYNCHRONIZING,
  SHARED_NOTE_UPTODATE,
} from "@/state/NoteStates";
import { isSharedNoteFile, setCurrentNoteState } from "@/utils";
import { encode } from "base64-arraybuffer";
import ObjectID from "bson-objectid";
import mime from "mime-types";
import { DataAdapter, TFile, Vault } from "obsidian";

export default class NoteSyncService extends ServerlessService {
  private static _instance: NoteSyncService;

  // some handy shortcuts
  private fsAdapter: DataAdapter;
  private vault: Vault;

  static get instance() {
    return NoteSyncService._instance;
  }

  constructor(plugin: SekundPluginReact) {
    super(plugin);
    this.fsAdapter = plugin.app.vault.adapter;
    this.vault = plugin.app.vault;
    NoteSyncService._instance = this;
  }

  async renameNote({ name, path }: TFile, oldPath: string) {
    const remoteNote = await this.getNoteByPath(oldPath);
    console.log("rename note");
    if (remoteNote) {
      await callFunction(this.plugin, "renameNote", [remoteNote._id, name, path]);
    }
  }

  async renameSharedNote(note: Note) {
    if (!GlobalState.instance.appState.userProfile._id.equals(note.userId)) {
      console.log("renamesharednote", note);
      // hack: the backend adds the previous path field to enable this use case
      const previousPath = (note as unknown as any).previousPath;
      const previousNotePath = `__sekund__/${note.userId.toString()}/${previousPath}`;
      const updatedNotePath = `__sekund__/${note.userId.toString()}/${note.path}`;
      const previousNoteFile = this.vault.getAbstractFileByPath(previousNotePath);
      if (previousNoteFile) {
        const updatedNoteDirs = updatedNotePath.substring(0, updatedNotePath.lastIndexOf("/"));
        await this.createDirs(updatedNoteDirs);
        this.vault.rename(previousNoteFile, updatedNotePath);
      }
    }
  }

  async unpublish() {
    const { remoteNote } = GlobalState.instance.appState;
    if (remoteNote) {
      // remote note can only be own note, because it is not allowed to
      // unpublish other peoples' notes
      await callFunction(this.plugin, "deleteNote", [remoteNote._id]);
      setCurrentNoteState(this.plugin.dispatchers, OWN_NOTE_LOCAL, undefined, null);
    }
  }

  async noLocalFile(note: Note) {
    // note state is irrevant here, the only relevant info is the note
    // the note component just needs to decide what to display based on
    // whether the note is an own note or a shared one
    setCurrentNoteState(this.plugin.dispatchers, null, null, note);
  }

  async compareNotes(file: TFile) {
    const { path, stat } = file;

    if (isSharedNoteFile(file)) {
      // let's not sync files when opened from the file system
      // const dirs = file.path.split("/");
      // this.syncDown(dirs.splice(2).join("/"), dirs[1]);
    } else {
      setCurrentNoteState(this.plugin.dispatchers, OWN_NOTE_FETCHING, file, null);

      const rNote = await this.getNoteByPath(path);

      if (!rNote) {
        setCurrentNoteState(this.plugin.dispatchers, OWN_NOTE_LOCAL, file, null);
      } else {
        const fileSynced = !!rNote && rNote.updated === stat.mtime;
        setCurrentNoteState(this.plugin.dispatchers, fileSynced ? OWN_NOTE_UPTODATE : OWN_NOTE_OUTDATED, file, rNote);
      }
    }
  }

  async getNoteByPath(path: string, userId?: string): Promise<Note | undefined> {
    return await callFunction(this.plugin, "getNoteByPath", [path, userId]);
  }

  async getNoteById(id: ObjectID): Promise<Note | undefined> {
    return await callFunction(this.plugin, "getNote", [id.toString()]);
  }

  async syncDown(id: ObjectID, userId: string) {
    const ownNote = userId === GlobalState.instance.appState.userProfile._id.toString();
    const rootDir = ownNote ? "" : `__sekund__/${userId}/`;
    const note = await this.getNoteById(id);
    if (note) {
      const fullPath = `${rootDir}${note.path}`;
      const noteFile = this.vault.getAbstractFileByPath(fullPath);
      const upToDate = noteFile && noteFile instanceof TFile && noteFile.stat.mtime > note.updated;
      if (!upToDate) {
        const dirs = fullPath.substring(0, fullPath.lastIndexOf("/"));
        await this.createDirs(dirs);
        const noteContents = ownNote
          ? note.content
          : `---
_id: ${note._id.toString()}
updated: ${note.updated}
---

${note.content}`;
        if (note.assets && note.assets.length > 0) {
          await this.downloadDependencies(note.assets, note.userId.toString(), note._id.toString());
        }
        await this.fsAdapter.write(fullPath, noteContents);
      }
      if (noteFile && noteFile instanceof TFile) {
        setCurrentNoteState(this.plugin.dispatchers, ownNote ? OWN_NOTE_UPTODATE : SHARED_NOTE_UPTODATE, noteFile, note);
        this.plugin.app.workspace.activeLeaf?.openFile(noteFile);
      } else {
        console.log("ERROR: Could not open file ", noteFile);
      }
    } else {
      console.log("ERROR: No remote file to sync down ", id, userId);
    }
  }

  async createDirs(path: string) {
    let directories = ".";
    for (const dir of path.split("/")) {
      directories = `${directories}/${dir}`;
      const dirExists = await this.fsAdapter.exists(directories);
      if (!dirExists) {
        await this.fsAdapter.mkdir(directories);
      }
    }
  }

  async uploadDependencies(assets: Array<string>, noteId: string) {
    const userId = GlobalState.instance.appState.userProfile._id.toString();
    assets.forEach(async (path) => {
      const assetFile = this.vault.getAbstractFileByPath(path);
      if (assetFile) {
        const blob = await this.fsAdapter.readBinary(path);
        const base64 = encode(blob);
        const mimeType = mime.lookup(assetFile.name);
        await callFunction(this.plugin, "upload", [base64, `${userId}/${noteId}/${assetFile.path}`, mimeType]);
      }
    });
  }

  async downloadDependencies(assets: Array<string>, noteUserId: string, noteId: string) {
    for (const path of assets) {
      const file: any = await callFunction(this.plugin, "download", [`${noteUserId}/${noteId}/${path}`]);
      const dependencyPath = `__sekund__/${noteUserId}/${path}`;
      await this.createDirs(dependencyPath.substring(0, dependencyPath.lastIndexOf("/")));
      await this.fsAdapter.writeBinary(dependencyPath, file.buffer);
    }
  }

  async syncFile() {
    const file = GlobalState.instance.appState.currentFile;
    if (file && GlobalState.instance.appState && this.plugin.user) {
      const ownNote = !isSharedNoteFile(file);
      setCurrentNoteState(this.plugin.dispatchers, ownNote ? OWN_NOTE_SYNCHRONIZING : SHARED_NOTE_SYNCHRONIZING, undefined, undefined);
      const content = await file.vault.read(file);
      const links = this.plugin.app.metadataCache.resolvedLinks[file.path];
      const assets = links ? Object.keys(links) : [];
      await callFunction(this.plugin, "upsertNote", [
        {
          path: file.path,
          title: file.name,
          content,
          created: file.stat.ctime,
          updated: file.stat.mtime,
          assets,
        },
      ]);
      const rNote = await this.getNoteByPath(file.path);
      if (rNote) {
        await this.uploadDependencies(assets, rNote._id.toString());
      }
      setTimeout(() => {
        setCurrentNoteState(this.plugin.dispatchers, ownNote ? OWN_NOTE_UPTODATE : SHARED_NOTE_UPTODATE, undefined, rNote);
      }, 100);
    }
  }
}
