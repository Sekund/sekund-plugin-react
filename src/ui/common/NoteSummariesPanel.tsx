import { Note } from '@/domain/Note';
import { useNotesContext } from '@/state/NotesContext';
import { NotesActionKind } from '@/state/NotesReducer';
import NoteSummaryComponent from '@/ui/common/NoteSummaryComponent';
import React from 'react';

type Props = {
	handleNoteClicked: (note: Note) => void;
}

export default function NoteSummariesPanel({ handleNoteClicked }: Props) {

	const { notesState, notesDispatch } = useNotesContext();

	const { notes } = notesState;

	console.log("notes", notes);

	if (notes && notes.length > 0) {
		return (
			<div className="absolute inset-0 flex flex-col w-full h-full bg-obs-primary">
				<div className="flex items-center h-8 px-2">
					<span className="font-medium text-obs-primary"
						onClick={() => notesDispatch({ type: NotesActionKind.ResetNotes, payload: [] })}>← Back</span>
				</div>
				<div className="flex flex-col w-full overflow-auto space-y-2px">
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