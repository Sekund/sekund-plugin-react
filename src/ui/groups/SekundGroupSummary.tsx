import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import { makeid } from "@/utils";
import { AdjustmentsIcon } from "@heroicons/react/solid";
import { AvatarGroup } from "@mui/material";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
type Props = {
  group: Group;
  editGroup: (group: Group) => void;
  displayGroup: (group: Group) => void;
  handleNoteClicked: (note: Note) => void;
  fetchUnread: () => Promise<void>;
};

export default function SekundGroupSummary({ group, editGroup, displayGroup, handleNoteClicked, fetchUnread }: Props) {
  const { t } = useTranslation();
  const expandedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };
  const { appState } = useAppContext();
  const { userProfile } = appState;

  async function fetchGroupNotes() {
    const groupNotes = await NotesService.instance.getGroupNotes(group._id.toString());
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: groupNotes });
  }

  async function toggleExpanded() {
    if (!expandedRef.current) {
      fetchGroupNotes();
    }
    expandedRef.current = !expandedRef.current;
    setExpanded(expandedRef.current);
  }

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(
      listenerId,
      new SekundEventListener(["modifySharingGroups", "note.delete"], async () => {
        await fetchGroupNotes();
        await fetchUnread();
      })
    );
    return () => {
      eventsWatcher?.removeEventListener(listenerId);
    };
  }, []);

  function groupMembers(group: Group): JSX.Element {
    const editAllowed = group.userId.equals(userProfile._id);
    return (
      <div
        className="flex items-center p-1 ml-1 space-x-1 overflow-hidden cursor-pointer"
        onClick={editAllowed ? () => editGroup(group) : () => displayGroup(group)}
      >
        <AvatarGroup className="h-6" sx={{ height: 24 }}>
          {group.peoples.map((people) => peopleAvatar(people, 6))}
        </AvatarGroup>
        <AdjustmentsIcon className="w-4 h-4" />
      </div>
    );
  }

  return (
    <NotesContext.Provider value={notesProviderState}>
      <div className="flex flex-col" style={{ borderRight: "none", borderLeft: "none" }}>
        <div
          key={group._id.toString()}
          className="flex items-center justify-between w-full mx-auto cursor-pointer bg-obs-primary-alt hover:bg-obs-primary"
          onClick={toggleExpanded}
        >
          <div className="flex items-center px-3 py-2 space-x-2 text-sm cursor-pointer">
            <div className="flex">{groupAvatar(group, 10)}</div>
            <div className="truncate text-md text-primary">{group.name}</div>
          </div>
          {groupMembers(group)}
        </div>
        {expanded ? <NoteSummariesPanel context="groups" handleNoteClicked={handleNoteClicked} /> : null}
      </div>
    </NotesContext.Provider>
  );
}
