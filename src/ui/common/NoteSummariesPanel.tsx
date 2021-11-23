import { Note } from '@/domain/Note';
import { useNotesContext } from '@/state/NotesContext';
import NoteSummaryComponent from '@/ui/common/NoteSummaryComponent';
import { ViewType } from '@/ui/main/SekundMainComponent';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	handleNoteClicked: (note: Note) => void;
	context: ViewType;
	className?: string;
}

export default function NoteSummariesPanel({ handleNoteClicked, className, context }: Props) {

	const { t } = useTranslation();

	const { notesState, notesDispatch } = useNotesContext();

	const { notes } = notesState;

	if (notes && notes.length > 0) {
		return (
			<div className={`$flex flex-col w-full bg-obs-primary`}>
				<div className={`${className} flex flex-col w-full overflow-auto space-y-1px bg-obs-primary`}>
					{notes?.map((note: Note) => (
						<React.Fragment key={note._id.toString()}>
							<NoteSummaryComponent context={context} note={note} handleNoteClicked={handleNoteClicked} />
						</React.Fragment>
					))}
				</div>
			</div>)
	}
	else return null;

}