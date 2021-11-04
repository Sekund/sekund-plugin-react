import { Note } from "@/domain/Note";
import filenamify from "@/helpers/filenamify";
import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import { AppAction } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import { OWN_NOTE_FETCHING, OWN_NOTE_LOCAL, OWN_NOTE_OUTDATED, OWN_NOTE_SYNCHRONIZING, OWN_NOTE_UPTODATE, SHARED_NOTE_SYNCHRONIZING, SHARED_NOTE_UPTODATE } from "@/state/NoteStates";
import { isSharedNoteFile, setCurrentNoteState } from "@/utils";
import { DataAdapter, TFile, Vault } from "obsidian";

export default class NoteSyncService extends ServerlessService {
	private static _instance: NoteSyncService;

	// some handy shortcuts
	private fsAdapter: DataAdapter;
	private vault: Vault;

	static get instance() {
		return NoteSyncService._instance;
	}

	constructor(plugin: SekundPluginReact, private dispatchers: React.Dispatch<AppAction>[]) {
		super(plugin);
		this.fsAdapter = plugin.app.vault.adapter;
		this.vault = plugin.app.vault;
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
			// remote note can only be own note, because it is not allowed to
			// unpublish other peoples' notes
			await callFunction(this.plugin, "deleteNote", [remoteNote._id]);
			setCurrentNoteState(this.dispatchers, OWN_NOTE_LOCAL, undefined, null);
		}
	}

	async noLocalFile(note: Note) {
		// note state is irrevant here, the only relevant info is the note
		// the note component just needs to decide what to display based on
		// whether the note is an own note or a shared one
		setCurrentNoteState(this.dispatchers, null, null, note);
	}

	async compareNotes(file: TFile) {
		const { path, stat } = file;

		if (isSharedNoteFile(file)) {
			const dirs = file.path.split("/");
			this.syncDown(dirs.splice(2).join("/"), dirs[1]);
		} else {
			setCurrentNoteState(this.dispatchers, OWN_NOTE_FETCHING, file, null);

			const rNote = await this.getNoteByPath(path);

			if (!rNote) {
				setCurrentNoteState(this.dispatchers, OWN_NOTE_LOCAL, file, null);
			} else {
				const fileSynced = !!rNote && rNote.updated === stat.mtime;
				setCurrentNoteState(this.dispatchers, fileSynced ? OWN_NOTE_UPTODATE : OWN_NOTE_OUTDATED, file, rNote);
			}
		}
	}

	async getNoteByPath(path: string, userId?: string): Promise<Note | undefined> {
		return await callFunction(this.plugin, "getNoteByPath", [path, userId]);
	}

	async syncDown(path: string, userId: string) {
		const ownNote = userId === GlobalState.instance.appState.userProfile._id.toString();
		const rootDir = ownNote ? "" : `__sekund__/${userId}/`;
		// console.log("syncDown", `[${path}]`, `[${userId}]`);
		const note = await this.getNoteByPath(path, userId);
		if (note) {
			const fullPath = `${rootDir}${path}`;
			const dirs = fullPath.substring(0, fullPath.lastIndexOf("/"));
			if (!(await this.fsAdapter.exists(fullPath))) {
				await this.createDirs(dirs);
				await this.fsAdapter.write(fullPath, note.content);
			}
			const noteFile = this.vault.getAbstractFileByPath(fullPath);
			if (noteFile && noteFile instanceof TFile) {
				setCurrentNoteState(this.dispatchers, ownNote ? OWN_NOTE_UPTODATE : SHARED_NOTE_UPTODATE, noteFile, note);
				this.plugin.app.workspace.activeLeaf?.openFile(noteFile);
			} else {
				console.log("ERROR: Could not open file ", noteFile);
			}
		} else {
			console.log("ERROR: No remote file to sync down ", path, userId);
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

	async syncFile() {
		const file = GlobalState.instance.appState.currentFile;
		if (file && GlobalState.instance.appState && this.plugin.user) {
			const ownNote = !isSharedNoteFile(file);
			setCurrentNoteState(this.dispatchers, ownNote ? OWN_NOTE_SYNCHRONIZING : SHARED_NOTE_SYNCHRONIZING, undefined, undefined);
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
			setTimeout(() => {
				setCurrentNoteState(this.dispatchers, ownNote ? OWN_NOTE_UPTODATE : SHARED_NOTE_UPTODATE, undefined, rNote);
			}, 100);
		}
	}
}
