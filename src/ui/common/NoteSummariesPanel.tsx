import { Note } from "@/domain/Note";
import { useAppContext } from "@/state/AppContext";
import { useNotesContext } from "@/state/NotesContext";
import Loader from "@/ui/common/LoaderComponent";
import NoteSummaryComponent from "@/ui/common/NoteSummaryComponent";
import { ViewType } from "@/ui/main/SekundMainComponent";
import SharingModal from "@/ui/modals/SharingModal";
import React, { useState } from "react";

type Props = {
  handleNoteClicked: (note: Note) => void;
  loading?: boolean;
  context: ViewType;
} & React.HTMLAttributes<HTMLDivElement>;

export default function NoteSummariesPanel({ handleNoteClicked, className, context, loading }: Props) {
  const { notesState } = useNotesContext();
  const { appState } = useAppContext();
  const [showSharingModal, setShowSharingModal] = useState(false);

  const { notes, note } = notesState;
  const { userProfile } = appState;

  function renderSharingDialog() {
    if (showSharingModal && note) {
      return <SharingModal userId={userProfile._id} open={showSharingModal} setOpen={setShowSharingModal} note={note}></SharingModal>;
    } else {
      return null;
    }
  }

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
        <div className={`${className} flex flex-col w-full overflow-auto space-y-1`}>
          {notes?.map((note: Note) => (
            <React.Fragment key={note._id.toString()}>
              <NoteSummaryComponent
                context={context}
                noteSummary={note}
                handleNoteClicked={handleNoteClicked}
                setShowSharingModal={setShowSharingModal}
              />
            </React.Fragment>
          ))}
        </div>
        {renderSharingDialog()}
      </div>
    );
  } else return null;
}
