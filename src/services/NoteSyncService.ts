import { Note } from "@/domain/Note";
import { mkdirs } from "@/fileutils";
import SekundPluginReact from "@/main";
import ReferencesService from "@/services/ReferencesService";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import GlobalState from "@/state/GlobalState";
import {
  NO_LOCAL_FILE,
  OWN_NOTE_FETCHING,
  OWN_NOTE_LOCAL,
  OWN_NOTE_OUTDATED,
  OWN_NOTE_SYNCHRONIZING,
  OWN_NOTE_UPTODATE,
  SHARED_NOTE_SYNCHRONIZING,
  SHARED_NOTE_UPTODATE,
} from "@/state/NoteStates";
import { isSharedNoteFile, setCurrentNoteState, wait } from "@/utils";
import { encode } from "base64-arraybuffer";
import ObjectID from "bson-objectid";
import { t } from "i18next";
import mime from "mime-types";
import { DataAdapter, normalizePath, TFile, Vault } from "obsidian";

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
    this.plugin.app.metadataCache.on("changed", (f: TFile, ctx?: any) => this.fileChanged(f, ctx));
  }

  fileChanged(f: TFile, ctx?: any) {
    console.log("file changed, updating references");
    setTimeout(() => {
      ReferencesService.instance.updateReferences();
    }, 100);
  }

  async renameNote({ name, path }: TFile, oldPath: string) {
    const remoteNote = await this.getNoteByPath(oldPath);
    if (remoteNote) {
      await callFunction(this.plugin, "renameNote", [remoteNote._id, name, path]);
    }
  }

  async renameSharedNote(note: Note) {
    if (!GlobalState.instance.appState.userProfile._id.equals(note.userId)) {
      // hack: the backend adds the previous path field to enable this use case
      const previousPath = (note as unknown as any).previousPath;
      const previousNotePath = normalizePath(`__sekund__/${note.userId.toString()}/${previousPath}`);
      const updatedNotePath = normalizePath(`__sekund__/${note.userId.toString()}/${note.path}`);
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
    setCurrentNoteState(this.plugin.dispatchers, NO_LOCAL_FILE, null, note);
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
        const fileSynced = !!rNote && rNote.modified === stat.mtime;
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
      let noteFile = this.vault.getAbstractFileByPath(normalizePath(fullPath));
      const upToDate = noteFile && noteFile instanceof TFile && noteFile.stat.mtime === note.modified;
      if (!upToDate) {
        const dirs = fullPath.substring(0, fullPath.lastIndexOf("/"));
        await this.createDirs(dirs);
        const noteContents = ownNote
          ? note.content
          : `---
_id: ${note._id.toString()}
modified: ${note.modified}
---

${note.content}`;
        if (note.assets && note.assets.length > 0) {
          const assets = [...new Set(note.assets)];
          if (assets.length > 1) {
            this.downloadDependencies(note.assets, note.userId.toString(), note._id.toString());
          } else {
            await this.downloadDependencies(note.assets, note.userId.toString(), note._id.toString());
          }
        }
        await this.fsAdapter.write(normalizePath(fullPath), noteContents);
        while (!noteFile) {
          noteFile = this.vault.getAbstractFileByPath(normalizePath(fullPath));
          wait(10);
        }
      }
      if (noteFile && noteFile instanceof TFile) {
        noteFile.stat.mtime = note.modified;
        setCurrentNoteState(this.plugin.dispatchers, ownNote ? OWN_NOTE_UPTODATE : SHARED_NOTE_UPTODATE, noteFile, note);
        this.plugin.app.workspace.activeLeaf?.openFile(noteFile);
      } else {
        console.log("ERROR: Could not open file ", noteFile);
      }
    } else {
      setCurrentNoteState(this.plugin.dispatchers, ownNote ? OWN_NOTE_UPTODATE : SHARED_NOTE_UPTODATE, undefined, note);
      console.log("ERROR: No remote file to sync down ", id, userId);
    }
  }

  async createDirs(path: string) {
    await mkdirs(normalizePath(path), this.fsAdapter);
  }

  async uploadDependencies(assets: Array<string>, noteId: string) {
    const userId = GlobalState.instance.appState.userProfile._id.toString();
    assets.forEach(async (path) => {
      path = normalizePath(path);
      const assetFile = this.vault.getAbstractFileByPath(path);
      if (assetFile) {
        const blob = await this.fsAdapter.readBinary(path);
        const base64 = encode(blob);
        const mimeType = mime.lookup(assetFile.name);
        await callFunction(this.plugin, "upload", [base64, `${userId}/${noteId}/${assetFile.path}`, mimeType]);
      }
    });
  }

  async downloadDependency(path: string, noteUserId: string, noteId: string) {
    const file: any = await callFunction(this.plugin, "download", [`${noteUserId}/${noteId}/${path}`]);
    const dependencyPath = `__sekund__/${noteUserId}/${path}`;
    await this.createDirs(normalizePath(dependencyPath.substring(0, dependencyPath.lastIndexOf("/"))));
    await this.fsAdapter.writeBinary(normalizePath(dependencyPath), file.buffer);
  }

  async downloadDependencies(assets: Array<string>, noteUserId: string, noteId: string) {
    await Promise.all(assets.map((p) => this.downloadDependency(p, noteUserId, noteId)));
  }

  findInclusions(content: string) {
    const inclusionsRe = /!\[\[(.*?)\]\]/gm;

    const matches = content.match(inclusionsRe);

    const inclusions: string[] = [];
    if (matches) {
      for (const match of matches) {
        inclusions.push(match.substring(3, match.length - 2).replace(/#\^[a-z0-9]*/, ""));
      }
    }
    return inclusions;
  }

  findLinks(content: string) {
    const linksRe = /\[\[(.*?)\]\]/gm;
    const matches = content.match(linksRe);

    const links: string[] = [];
    if (matches) {
      for (const match of matches) {
        links.push(match.substring(2, match.length - 2));
      }
    }
    return links;
  }

  /**
   * We want upload file references only if they exist, that is if they are
   * in the resolvedLinks metadata. However, inclusions as parsed from the
   * markdown file will refer to files by their name only, unless the same
   * file name exists at different paths.
   */
  fileRefsIntersectingResolvedLinks(fileReferences: string[], links: Record<string, number>) {
    const fullPaths: string[] = [];
    const existingPaths = Object.keys(links);
    fileReferences.forEach((fileReference) => {
      fileReference = fileReference.substring(0, fileReference.lastIndexOf("|"));
      existingPaths.forEach((fullPath) => {
        const truncated = fullPath.replace(fileReference, "");
        if (fullPath.length - truncated.length === fileReference.length) {
          fullPaths.push(fullPath);
        }
      });
    });
    return fullPaths;
  }

  async syncFile() {
    const file = GlobalState.instance.appState.currentFile;
    if (file && GlobalState.instance.appState && this.plugin.user) {
      const ownNote = !isSharedNoteFile(file);
      setCurrentNoteState(this.plugin.dispatchers, ownNote ? OWN_NOTE_SYNCHRONIZING : SHARED_NOTE_SYNCHRONIZING, undefined, undefined);
      const content = await file.vault.read(file);
      const links = this.plugin.app.metadataCache.resolvedLinks[file.path];
      const assets = this.fileRefsIntersectingResolvedLinks(this.findInclusions(content), links);
      const fileStat = await this.fsAdapter.stat(normalizePath(file.path));
      await callFunction(this.plugin, "upsertNote", [
        {
          path: file.path,
          title: file.name,
          content,
          created: fileStat && fileStat.ctime > 0 ? fileStat.ctime : fileStat?.mtime,
          modified: fileStat?.mtime,
          updated: fileStat?.mtime,
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
