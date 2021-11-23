import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { useNotesContext } from "@/state/NotesContext";
import { NotesActionKind } from "@/state/NotesReducer";
import { usePeoplesContext } from "@/state/PeoplesContext";
import { ViewType } from "@/ui/main/SekundMainComponent";
import { originalPath } from "@/utils";
import { ArrowDownIcon, ArrowUpIcon, ChatAlt2Icon, DownloadIcon, UploadIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React from 'react';
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";
import { isContext } from "vm";

type Props = {
	note: Note
	context: ViewType;
	handleNoteClicked: (note: Note) => void
}

export default function NoteSummaryComponent({ note, handleNoteClicked, context }: Props) {
	const { i18n } = useTranslation();
	const { appState } = useAppContext();

	const { peoplesState } = usePeoplesContext();
	const { notesDispatch } = useNotesContext();

	const { remoteNote, currentFile } = appState;

	function stats(note: Note) {
		const children: Array<JSX.Element> = [];
		if (note.sharing.peoples && note.sharing.peoples.length > 0) {
			children.push(<div key="sppls" className="flex items-center"><UsersIcon className="w-4 h-4" />{note.sharing.peoples.length}</div>)
		}
		if (note.sharing.groups && note.sharing.groups.length > 0) {
			children.push(<div key="sgps" className="flex items-center"><UserGroupIcon className="w-4 h-4" />{note.sharing.groups.length}</div>)
		}
		if (note.comments && note.comments.length > 0) {
			children.push(<div key="cmts" className="flex items-center"><ChatAlt2Icon className="w-4 h-4" />{note.comments.length}</div>)
		}
		return <div className="flex items-center space-x-1 text-obs-muted">{children}</div>
	}

	function readStatusClass() {
		if (note && currentFile) {
			// console.log("comparing isRead with updated, isRead: " +
			// 	hourMinSec(note.isRead) + ", updated: " + hourMinSec(note.updated)
			// 	+ " (" + note.title + ")", remoteNote?.path, originalPath(currentFile));
			if (currentFile && note.path === originalPath(currentFile)) {
				// console.log("we are looking at the updated file")
				return "";
			}
			if (note.isRead && note.updated > note.isRead) {
				return "font-bold"
			}
		}
		return "";
	}

	function renderUpOrDownArrow() {
		if (appState.userProfile._id.equals(note.userId)) {
			return <ArrowUpIcon className="w-4 h-4 text-green-500" />
		}
		return <ArrowDownIcon className="w-4 h-4 text-blue-500" />
	}

	function summaryContents(upOrDownArrow?: boolean) {
		return <>
			<div className={`${readStatusClass()}`}>
				{upOrDownArrow
					? <div className="flex items-center space-x-2">{renderUpOrDownArrow()}{note.title.replace(".md", "")}</div>
					: note.title.replace(".md", "")
				}
			</div>
			<div className="flex items-center justify-between">
				<ReactTimeAgo className="text-obs-muted" date={+note.created} locale={i18n.language} />
				{stats(note)}
			</div>
		</>
	}

	function isCurrentNote() {
		return note._id.equals(remoteNote?._id || new ObjectID())
	}

	async function noteClicked() {

		if (NotesService.instance) {
			await NotesService.instance.setNoteIsRead(note._id);
		}
		notesDispatch({ type: NotesActionKind.SetNoteIsRead, payload: note._id })
		handleNoteClicked(note);

	}

	function summary(upOrDownArrow?: boolean) {
		return <div className={`flex flex-col px-3 py-2 text-sm transition cursor-pointer bg-obs-primary-alt hover:bg-obs-tertiary ${isCurrentNote() ? 'bg-obs-tertiary' : ''}`}
			onClick={noteClicked}>
			{summaryContents(upOrDownArrow)}
		</div>
	}

	function withAvatar(summary: JSX.Element) {
		const author: People | undefined = peoplesState.currentGroup?.peoples.filter(p => p._id.equals(note.userId))[0]
		if (author) {
			return <div className={`flex space-x-2 items-center px-3 py-2 text-sm transition cursor-pointer bg-obs-primary-alt hover:bg-obs-tertiary ${isCurrentNote() ? 'bg-obs-tertiary' : ''}`} onClick={noteClicked} >
				<div className="flex-shrink-0">{peopleAvatar(author, 8)}</div>
				<div className="flex flex-col flex-grow">{summaryContents()}</div>
			</div>
		}
		return summary
	}

	if (context === 'groups') {
		return withAvatar(summary());
	} else if (context === 'peoples') {
		return summary(true)
	}
	return summary()

}