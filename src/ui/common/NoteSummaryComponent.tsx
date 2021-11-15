import { Note } from "@/domain/Note"
import { People } from "@/domain/People";
import { getAvatar, peopleAvatar } from "@/helpers/avatars";
import { useAppContext } from "@/state/AppContext";
import { usePeoplesContext } from "@/state/PeoplesContext";
import { ChatAlt2Icon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React from 'react';
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";

type Props = {
	note: Note
	handleNoteClicked: (note: Note) => void
}

export default function NoteSummaryComponent({ note, handleNoteClicked }: Props) {
	const { i18n } = useTranslation();
	const { appState } = useAppContext();

	const { peoplesState, peoplesDispatch } = usePeoplesContext();

	const { remoteNote } = appState;

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

	function summaryContents() {
		return <>
			<div>
				{note.title.replace(".md", "")}
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

	function summary() {
		return <div className={`flex flex-col px-3 py-2 text-sm transition cursor-pointer bg-obs-primary-alt hover:bg-obs-tertiary ${isCurrentNote() ? 'bg-obs-tertiary' : ''}`}
			onClick={() => handleNoteClicked(note)}>
			{summaryContents()}
		</div>
	}

	function withAvatar(summary: JSX.Element) {
		const author: People | undefined = peoplesState.currentGroup?.peoples.filter(p => p._id.equals(remoteNote?.userId || new ObjectID()))[0]
		if (author) {
			return <div className={`flex space-x-2 items-center px-3 py-2 text-sm transition cursor-pointer bg-obs-primary-alt hover:bg-obs-tertiary ${isCurrentNote() ? 'bg-obs-tertiary' : ''}`} onClick={() => handleNoteClicked(note)} >
				<div className="flex-shrink-0">{peopleAvatar(author, 8)}</div>
				<div className="flex flex-col flex-grow">{summaryContents()}</div>
			</div>
		}
		return summary
	}

	return (
		peoplesState && peoplesState.groups
			? withAvatar(summary())
			: summary()
	)

}