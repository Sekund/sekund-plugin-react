import { Note } from "@/domain/Note"
import { ChatAlt2Icon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import React from 'react';
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";

type Props = {
	note: Note
	handleNoteClicked: (note: Note) => void
}

export default function NoteSummaryComponent({ note, handleNoteClicked }: Props) {
	const { i18n } = useTranslation();

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


	return (
		<div className="flex flex-col px-3 py-2 text-sm transition cursor-pointer bg-obs-primary-alt hover:bg-obs-tertiary"
			onClick={() => handleNoteClicked(note)}>
			<div>
				{note.title.replace(".md", "")}
			</div>
			<div className="flex items-center justify-between">
				<ReactTimeAgo className="text-obs-muted" date={+note.created} locale={i18n.language} />
				{stats(note)}
			</div>
		</div>

	)

}