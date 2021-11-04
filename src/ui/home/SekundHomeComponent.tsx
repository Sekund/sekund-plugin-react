import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import NoteSummaryComponent from "@/ui/common/NoteSummaryComponent";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { EmojiSadIcon } from "@heroicons/react/solid";
import { TFile } from "obsidian";
import React, { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

export type HomeComponentProps = {
	view: { addAppDispatch: Function };
	notesService: NotesService | undefined;
	syncDown: (path: string, userId: string) => void,
}

export const SekundHomeComponent = ({ notesService, syncDown }: HomeComponentProps) => {
	const { t } = useTranslation(["common", "plugin"]);
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
		const file = appState.plugin?.app.vault.getAbstractFileByPath(note.path);
		if (file) {
			if (appState.plugin?.app.workspace.activeLeaf) {
				appState.plugin.app.workspace.activeLeaf.openFile(file as TFile)
			} else {
				console.log("no active leaf")
			}
		} else {
			syncDown(note.path, note.userId.toString())
		}
	}

	if (notes && notes.length > 0) {
		return (
			<NotesContext.Provider value={notesProviderState}>
				<div className="flex flex-col w-full overflow-auto space-y-1px">
					{notes?.map((note: Note) => (
						<React.Fragment key={note._id.toString()}>
							<NoteSummaryComponent note={note} handleNoteClicked={openNoteFile} />
						</React.Fragment>
					))}
				</div>
			</NotesContext.Provider>)
	}
	else return (
		<div className="fixed inset-0 flex flex-col items-center justify-center p-8">
			<div className="flex justify-center mb-2"><EmojiSadIcon className="w-6 h-6" /></div>
			<div className="text-center ">{t('noNotes')}</div>
			<div className="mt-2 text-sm text-center ">{t('plugin:noNotesDesc')}</div>
		</div>)
}

export default (props: HomeComponentProps) => withConnectionStatus(props)(SekundHomeComponent)