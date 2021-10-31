import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import NoteSummaryComponent from "@/ui/common/NoteSummaryComponent";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { TFile } from "obsidian";
import React, { useEffect, useReducer } from "react";

export type HomeComponentProps = {
	view: { addAppDispatch: Function };
	notesService: NotesService | undefined;
	syncDown: (path: string) => void,
}

export const SekundHomeComponent = ({ notesService, syncDown }: HomeComponentProps) => {
	const { appState } = useAppContext();
	const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
	const notesProviderState = {
		notesState,
		notesDispatch,
	};
	let gen: AsyncGenerator<Realm.Services.MongoDB.ChangeEvent<any>, any, unknown>;

	const { notes } = notesState;

	async function fetchNotes() {
		if (!notesService) {
			notesService = NotesService.instance;
		}
		const notes = await notesService.getNotes(Date.now(), 10000);
		notesDispatch({ type: NotesActionKind.ResetNotes, payload: notes });
	}

	useEffect(() => {
		if (appState.generalState === "allGood") {
			fetchNotes();
		}
	}, [appState.generalState])

	useEffect(() => {
		(async () => {
			if (appState.plugin && appState.plugin.user) {
				console.log("putting notes watcher in place...");
				const notes = appState.plugin.user.mongoClient("mongodb-atlas").db(appState.plugin.settings.subdomain).collection("notes");
				if (notes) {
					gen = notes.watch();
					for await (const change of gen) {
						handleNotesChange(change);
					}
				}
			}
		})()
		return () => {
			if (gen) {
				gen.return(undefined);
			}
		}
	}, []);

	async function handleNotesChange(change: Realm.Services.MongoDB.ChangeEvent<any>) {
		const updtNotes = await NotesService.instance.getNotes(Date.now(), 10000);
		notesDispatch({ type: NotesActionKind.ResetNotes, payload: updtNotes });
	}

	async function openNoteFile(note: Note) {
		console.log("looking to open file at path: " + note.path)
		const file = appState.plugin?.app.vault.getAbstractFileByPath(note.path);
		if (file) {
			console.log("found local file")
			if (appState.plugin?.app.workspace.activeLeaf) {
				console.log("activeLeaf is live, opening file...")
				appState.plugin.app.workspace.activeLeaf.openFile(file as TFile)
			} else {
				console.log("no active leaf")
			}
		} else {
			console.log("no local file, downloading remote note")
			syncDown(note.path)
		}
	}

	return (
		<NotesContext.Provider value={notesProviderState}>
			<div className="flex flex-col w-full overflow-auto space-y-2px">
				{notes?.map((note: Note) => (
					<React.Fragment key={note._id.toString()}>
						<NoteSummaryComponent note={note} handleNoteClicked={openNoteFile} />
					</React.Fragment>
				))}
			</div>
		</NotesContext.Provider>)
}

export default (props: HomeComponentProps) => withConnectionStatus(props)(SekundHomeComponent)