import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { AvatarGroup } from "@mui/material";
import React, { useReducer, useState } from "react";
type Props = {
  group: Group;
  editGroup: (group: Group) => void;
  handleNoteClicked: (note: Note) => void;
};

export default function SekundGroupSummary({ group, editGroup, handleNoteClicked }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };
  const { appState } = useAppContext();
  const { userProfile } = appState;

  async function toggleExpanded() {
    if (!expanded) {
      const groupNotes = await NotesService.instance.getGroupNotes(group._id.toString());
      groupNotes.sort((a: Note, b: Note) => a.created - b.created);
      notesDispatch({ type: NotesActionKind.ResetNotes, payload: groupNotes });
    }
    setExpanded(!expanded);
  }

  function groupMembers(group: Group): JSX.Element {
    const editAllowed = group.userId.equals(userProfile._id);
    return (
      <div className="flex items-center p-1 overflow-hidden" onClick={editAllowed ? () => editGroup(group) : undefined}>
        <AvatarGroup className="h-6" sx={{ height: 24 }}>
          {group.peoples.map((people) => peopleAvatar(people, 6))}
        </AvatarGroup>

        {editAllowed ? <DotsHorizontalIcon className="w-4 h-4" /> : ""}
      </div>
    );
  }

  return (
    <NotesContext.Provider value={notesProviderState}>
      <div className="flex flex-col" style={{ borderRight: "none", borderLeft: "none" }}>
        <div
          key={group._id.toString()}
          className="flex items-center justify-between w-full mx-auto bg-obs-primary-alt hover:bg-obs-tertiary"
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
