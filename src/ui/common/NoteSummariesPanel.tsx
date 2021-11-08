import { Note } from '@/domain/Note';
import { useNotesContext } from '@/state/NotesContext';
import { NotesActionKind } from '@/state/NotesReducer';
import NoteSummaryComponent from '@/ui/common/NoteSummaryComponent';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	handleNoteClicked: (note: Note) => void;
}

export default function NoteSummariesPanel({ handleNoteClicked }: Props) {

	const { t } = useTranslation();

	const { notesState, notesDispatch } = useNotesContext();

	const { notes } = notesState;

	if (notes && notes.length > 0) {
		return (
			<div className="fixed inset-0 flex flex-col w-full h-full bg-obs-primary">
				<div className="flex items-center h-8 px-2">
					<span className="font-medium text-normal"
						onClick={() => notesDispatch({ type: NotesActionKind.ResetNotes, payload: [] })}>← {t('back')}</span>
				</div>
				<div className="flex flex-col w-full overflow-auto space-y-1px">
					{notes?.map((note: Note) => (
						<React.Fragment key={note._id.toString()}>
							<NoteSummaryComponent note={note} handleNoteClicked={handleNoteClicked} />
						</React.Fragment>
					))}
				</div>
			</div>)
	}
	else return null;

}