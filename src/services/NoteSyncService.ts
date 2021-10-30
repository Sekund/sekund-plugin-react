import { Note } from "@/domain/Note";
import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import { AppAction, AppActionKind } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import { dispatch, setCurrentNoteState } from "@/utils";
import { DataAdapter, TFile, Vault } from "obsidian";
import filenamify from "@/helpers/filenamify";

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
			await callFunction(this.plugin, "deleteNote", [remoteNote._id]);
			setCurrentNoteState(this.dispatchers, { published: false, fileSynced: false });
		}
	}

	async noLocalFile(note: Note) {
		dispatch(this.dispatchers, AppActionKind.SetRemoteNote, note);
		dispatch(this.dispatchers, AppActionKind.SetCurrentFile, undefined);
	}

	async compareNotes(file: TFile) {
		console.log("comparing notes...");
		const { path, stat } = file;
		const isShared = path.startsWith("__sekund__");
		dispatch(this.dispatchers, AppActionKind.SetCurrentFile, file);
		console.log("setting current note state to published false");
		setCurrentNoteState(this.dispatchers, { fetching: true, published: false, isShared });
		let fileSynced = true;
		let published = true;
		if (!isShared) {
			const rNote = await this.getNoteByPath(path);
			fileSynced = !!rNote && rNote.updated === stat.mtime;
			published = rNote !== null;
		}
		const noteState = { fileSynced, fetching: false, published: true };
		console.log("now file is synched, noteState ", noteState);
		setCurrentNoteState(this.dispatchers, noteState);
	}

	async getNoteByPath(path: string): Promise<Note | undefined> {
		const nbp = await callFunction(this.plugin, "getNoteByPath", [path]);
		dispatch(this.dispatchers, AppActionKind.SetRemoteNote, nbp);
		return nbp;
	}

	async syncDown(note: Note) {
		const ownNote = note.userId.equals(GlobalState.instance.appState.userProfile._id);
		const rootDir = ownNote ? "" : `__sekund__/${note.userId.toString()}/`;
		let dirs = `${rootDir}${note.path}`;
		dirs = dirs.substring(0, dirs.lastIndexOf("/"));
		const fullPath = `${dirs}/${filenamify(note.title)}.md`;
		if (await this.fsAdapter.exists(fullPath)) {
			console.log(`The file already exists at ${fullPath}`);
		} else {
			console.log("writing file...");
			await this.createDirs(dirs);
			await this.fsAdapter.write(fullPath, note.content);
		}
		const noteFile = this.vault.getAbstractFileByPath(fullPath);
		if (noteFile && noteFile instanceof TFile) {
			console.log("opening file ", noteFile);
			this.plugin.app.workspace.activeLeaf?.openFile(noteFile);
			const rNote = await callFunction(this.plugin, "getNote", [note._id.toString()]);
			dispatch(this.dispatchers, AppActionKind.SetRemoteNote, rNote);
			this.compareNotes(noteFile);
		} else {
			console.log("Could not open file ", noteFile);
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
			dispatch(this.dispatchers, AppActionKind.SetRemoteNote, rNote);
			setTimeout(() => {
				setCurrentNoteState(this.dispatchers, { publishing: false, published: true, fileSynced: true, synchronizing: false });
			}, 800);
		}
	}
}
