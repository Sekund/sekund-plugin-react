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
import ObjectID from "bson-objectid";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  group: Group;
  editGroup: (group: Group) => void;
  displayGroup: (group: Group) => void;
  handleNoteClicked: (note: Note) => void;
};

export default function SekundGroupSummary({ group, editGroup, displayGroup, handleNoteClicked }: Props) {
  const { t } = useTranslation();
  const expandedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const [loading, setLoading] = useState(true);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };
  const { appState } = useAppContext();
  const { userProfile, unreadNotes } = appState;

  async function fetchGroupNotes() {
    setLoading(true);
    if (NotesService.instance) {
      const groupNotes = await NotesService.instance.getGroupNotes(group._id.toString());
      notesDispatch({ type: NotesActionKind.ResetNotes, payload: groupNotes });
    }
    setLoading(false);
  }

  async function toggleExpanded() {
    expandedRef.current = !expandedRef.current;
    setExpanded(expandedRef.current);
    if (expandedRef.current) {
      fetchGroupNotes();
    }
  }

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(
      listenerId,
      new SekundEventListener(["modifySharingGroups", "note.delete"], async () => {
        await fetchGroupNotes();
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
        className="flex items-center flex-shrink-0 p-1 ml-1 space-x-1 overflow-hidden cursor-pointer"
        onClick={editAllowed ? () => editGroup(group) : () => displayGroup(group)}
      >
        <AvatarGroup className="h-6" sx={{ height: 24 }}>
          {group.peoples.map((people) => peopleAvatar(people, 6))}
        </AvatarGroup>
        <AdjustmentsIcon className="flex-shrink-0 w-4 h-4" />
      </div>
    );
  }

  function badge() {
    let count = 0;
    for (const groupNote of unreadNotes.groups) {
      if (groupNote.sharing.groups) {
        for (const noteGroup of groupNote.sharing.groups) {
          if ((noteGroup as unknown as ObjectID).equals(group._id)) {
            count += 1;
          }
        }
      }
    }
    return count;
  }

  return (
    <NotesContext.Provider value={notesProviderState}>
      <div className="flex flex-col" style={{ borderRight: "none", borderLeft: "none" }}>
        <div
          key={group._id.toString()}
          className="flex items-center justify-between w-full mx-auto cursor-pointer bg-obs-primary-alt hover:bg-obs-primary"
        >
          <div className="flex items-center px-3 py-2 space-x-2 overflow-hidden text-sm cursor-pointer" onClick={toggleExpanded}>
            <div className="flex">{groupAvatar(group, 10, badge())}</div>
            <div className="truncate text-md text-primary hover:underline">{group.name}</div>
          </div>
          <div className="flex">{groupMembers(group)}</div>
        </div>
        {expanded ? (
          <>
            {/* {badge() > 0 ? (
              <div className="flex justify-between px-3 py-1 space-x-2 text-obs-muted">
                <div className="flex items-center space-x-1 text-sm cursor-pointer hover:underline hover:text-obs-normal">
                  <span>{t("plugin:updateAll")}</span>
                  <RefreshIcon className="w-4 h-4" />
                </div>
                <div className="flex items-center space-x-1 text-sm cursor-pointer hover:underline hover:text-obs-normal">
                  <span>{t("plugin:markAllRead")}</span>
                  <CheckIcon className="w-4 h-4" />
                </div>
              </div>
            ) : null} */}
            <NoteSummariesPanel context="groups" loading={loading} handleNoteClicked={handleNoteClicked} />
          </>
        ) : null}
      </div>
    </NotesContext.Provider>
  );
}
