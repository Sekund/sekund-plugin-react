import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import PeoplesContext from "@/state/PeoplesContext";
import PeoplesReducer, { initialPeoplesState, PeoplesActionKind } from "@/state/PeoplesReducer";
import GroupModal from "@/ui/groups/GroupModal";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid } from "@/utils";
import { DotsHorizontalIcon, EmojiSadIcon, PlusIcon } from "@heroicons/react/solid";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

export type GroupsComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  syncDown: (path: string, userId: string) => void,
}

export const SekundGroupsComponent = ({ peoplesService, syncDown }: GroupsComponentProps) => {
  const { appState } = useAppContext();
  const { t } = useTranslation();
  const [peoplesState, peoplesDispatch] = useReducer(PeoplesReducer, initialPeoplesState);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };
  const peoplesProviderState = {
    peoplesState,
    peoplesDispatch,
  };

  const { userProfile } = appState;
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
      return <GroupModal open={showNewGroupModal} setOpen={setShowNewGroupModal} group={currentGroup} />
    } else {
      return null;
    }
  }

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(listenerId, new SekundEventListener(["modifySharingGroups"], fetchGroups))
    return () => {
      eventsWatcher?.removeEventListener(listenerId);
    }
  }, [])

  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchGroups();
    }
  }, [appState.generalState])

  // render

  function editGroup(group: Group) {
    setCurrentGroup(group);
    setShowNewGroupModal(true);
  }

  function createGroup() {
    console.log("create group")
    setCurrentGroup(null);
    setShowNewGroupModal(true);
  }

  async function displayMessages(group: Group) {
    const sharingNotes = await NotesService.instance.getGroupNotes(group._id.toString());
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: sharingNotes })
  }

  function noteClicked(note: Note) {
    syncDown(note.path, note.userId.toString());
  }

  function groupMembers(group: Group): JSX.Element {
    const editAllowed = group.userId.equals(userProfile._id)
    return (<div className="flex p-1 -space-x-1 overflow-hidden" onClick={editAllowed ? () => editGroup(group) : undefined}>
      <div className="flex flex-row items-center -space-x-1">
        {group.peoples.map((people) => {
          return <React.Fragment key={people._id?.toString()}>{peopleAvatar(people)}</React.Fragment>;
        })}
        {editAllowed ? <DotsHorizontalIcon className="w-4 h-4" /> : ""}
      </div>
    </div>
    )
  }

  return (
    <PeoplesContext.Provider value={peoplesProviderState}>
      <NotesContext.Provider value={notesProviderState}>
        <>
          {groups && groups.length > 0 ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-end w-full h-8 px-2 text-xs">
                <div className="flex items-center p-1 space-x-1 border rounded-md mr-2px dark:border-obs-modal text-normal" onClick={createGroup}>
                  <PlusIcon className="w-4 h-4" /> <span className="py-0">{t('new_group')}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-1px w-xl">
                {groups.map((group: Group) => {
                  return (
                    <div key={group._id.toString()} className="flex items-center justify-between w-full mx-auto bg-obs-primary-alt hover:bg-obs-tertiary">
                      <div className="flex items-center px-3 py-2 space-x-2 text-sm cursor-pointer"
                        onClick={() => displayMessages(group)}>
                        <div className="flex">{groupAvatar(group, 10)}</div>
                        <div className="truncate text-md text-primary">{group.name}</div>
                      </div>
                      {groupMembers(group)}
                    </div>
                  );
                })}
              </div>
            </div>
          )
            : (
              <div className="fixed inset-0 flex flex-col items-center justify-center p-8">
                <div className="flex justify-center mb-2"><EmojiSadIcon className="w-6 h-6" /></div>
                <div className="text-center ">{t('plugin:noGroups')}</div>
                <div className="mt-2 text-sm text-center ">{t('plugin:noGroupsDesc')}</div>
                <button onClick={createGroup} className="flex items-center mt-2 mod-cta">
                  <PlusIcon className="w-4 h-4 mr-1 mod-cta" />{t('new_group')}
                </button>
              </div>
            )
          }
          {renderNewGroupDialog()}
        </>
      </NotesContext.Provider>
    </PeoplesContext.Provider>)

}

export default (props: GroupsComponentProps) => withConnectionStatus(props)(SekundGroupsComponent)