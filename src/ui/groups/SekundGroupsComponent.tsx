import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import PeoplesReducer, { initialPeoplesState, PeoplesActionKind } from "@/state/PeoplesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import GroupModal from "@/ui/groups/GroupModal";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { EmojiSadIcon, PlusIcon } from "@heroicons/react/solid";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

export type GroupsComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
}

export const SekundGroupsComponent = ({ peoplesService }: GroupsComponentProps) => {
  const { appState } = useAppContext();
  const { t } = useTranslation();
  const [peoplesState, peoplesDispatch] = useReducer(PeoplesReducer, initialPeoplesState);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };

  const { groups } = peoplesState;

  async function fetchGroups() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }
    const groups = await peoplesService.getUserGroups();
    peoplesDispatch({ type: PeoplesActionKind.SetGroups, payload: groups });
  }

  function renderNewGroupDialog() {
    if (showNewGroupModal) {
      return <GroupModal open={showNewGroupModal} setOpen={setShowNewGroupModal} group={null} />
    } else {
      return null;
    }
  }
  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchGroups();
    }
  }, [appState.generalState])

  // render

  async function displayMessages(group: Group) {
    const sharingNotes = await NotesService.instance.getGroupNotes(group._id.toString());
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: sharingNotes })
  }

  function noteClicked(note: Note) {
    console.log("note was clicked");
  }

  if (groups && groups.length > 0) {
    return (
      <NotesContext.Provider value={notesProviderState}>
        <div className="flex flex-col">
          <div className="flex items-center justify-end w-full h-8 px-2 text-xs">
            <div className="flex items-center p-1 space-x-1 border rounded-md mr-2px dark:border-obs-modal text-obs-primary" onClick={() => setShowNewGroupModal(true)}>
              <PlusIcon className="w-4 h-4" /> <span className="py-0">{t('new_group')}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2px w-xl">
            {groups.map((group: Group) => {
              return (
                <div key={group._id.toString()} className="flex items-center justify-between w-full mx-auto bg-obs-primary-alt hover:bg-obs-tertiary">
                  <div className="flex items-center px-3 py-2 space-x-2 text-sm cursor-pointer"
                    onClick={() => displayMessages(group)}>
                    <div className="flex">{groupAvatar(group, 10)}</div>
                    <div className="truncate text-md text-primary">{group.name}</div>
                  </div>
                  <div className="flex p-1 -space-x-1 overflow-hidden">
                    {group.peoples.map((people) => {
                      return <React.Fragment key={people._id?.toString()}>{peopleAvatar(people)}</React.Fragment>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <NoteSummariesPanel handleNoteClicked={noteClicked} />
        {renderNewGroupDialog()}
      </NotesContext.Provider>)
  } else return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-8">
      <div className="flex justify-center mb-2"><EmojiSadIcon className="w-6 h-6" /></div>
      <div className="text-center ">{t('plugin:noGroups')}</div>
      <div className="mt-2 text-sm text-center ">{t('plugin:noGroupsDesc')}</div>
    </div>)

}

export default (props: GroupsComponentProps) => withConnectionStatus(props)(SekundGroupsComponent)