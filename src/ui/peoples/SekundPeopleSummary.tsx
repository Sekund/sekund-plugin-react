import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import { makeid } from "@/utils";
import React, { useEffect, useReducer, useState } from "react";
type Props = {
  people: People;
  handleNoteClicked: (note: Note) => void;
};

export default function SekundPeopleSummary({ people, handleNoteClicked }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };

  useEffect(() => {
    const listListenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;

    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(listListenerId, new SekundEventListener(["modifySharingPeoples"], reloadList));
    return () => {
      eventsWatcher?.removeEventListener(listListenerId);
    };
  }, []);

  function reloadList() {}

  async function toggleExpanded() {
    if (!expanded) {
      const sharedNotes = await NotesService.instance.getSharedNotes(people._id.toString());
      sharedNotes.sort((a: Note, b: Note) => a.created - b.created);
      notesDispatch({ type: NotesActionKind.ResetNotes, payload: sharedNotes });
    }
    setExpanded(!expanded);
  }

  const unreadCount = people.unreadSharing || 0 + people.unreadShared || 0;

  return (
    <NotesContext.Provider value={notesProviderState}>
      <div className="flex flex-col" style={{ borderRight: "none", borderLeft: "none" }}>
        <div className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer bg-obs-primary hover:bg-obs-primary-alt">
          <div className="flex items-center flex-1 overflow-hidden" onClick={toggleExpanded}>
            <div className="flex-shrink-0">{peopleAvatar(people, 10, unreadCount && unreadCount > 0 ? unreadCount : undefined)}</div>
            <div className="flex items-center flex-1 min-w-0 ml-2 space-x-1 focus:outline-none">
              <p className="text-sm truncate text-primary">{people.name || people.email}</p>
            </div>
          </div>
        </div>
        {expanded ? <NoteSummariesPanel context="peoples" handleNoteClicked={handleNoteClicked} /> : null}
      </div>
    </NotesContext.Provider>
  );
}
