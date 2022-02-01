import { Note } from "@/domain/Note";
import { useNotesContext } from "@/state/NotesContext";
import Loader from "@/ui/common/LoaderComponent";
import NoteSummaryComponent from "@/ui/common/NoteSummaryComponent";
import { ViewType } from "@/ui/main/SekundMainComponent";
import React from "react";

type Props = {
  handleNoteClicked: (note: Note) => void;
  loading?: boolean;
  context: ViewType;
} & React.HTMLAttributes<HTMLDivElement>;

export default function NoteSummariesPanel({ handleNoteClicked, className, context, loading }: Props) {
  const { notesState } = useNotesContext();

  const { notes } = notesState;

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="w-20 h-20" />
      </div>
    );
  }

  if (notes && notes.length > 0) {
    return (
      <div className={`flex flex-col w-full`}>
        <div className={`${className} flex flex-col w-full overflow-auto space-y-1px`}>
          {notes?.map((note: Note) => (
            <React.Fragment key={note._id.toString()}>
              <NoteSummaryComponent context={context} noteSummary={note} handleNoteClicked={handleNoteClicked} />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  } else return null;
}
