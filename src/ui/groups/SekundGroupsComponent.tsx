import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import PeoplesContext from "@/state/PeoplesContext";
import PeoplesReducer, { initialPeoplesState, PeoplesActionKind } from "@/state/PeoplesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import GroupModal from "@/ui/groups/GroupModal";
import SekundGroupSummary from "@/ui/groups/SekundGroupSummary";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid, touch } from "@/utils";
import { EmojiSadIcon, PlusIcon } from "@heroicons/react/solid";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

export type GroupsComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  syncDown: (path: string, userId: string) => void,
} & React.HTMLAttributes<HTMLDivElement>;

export const SekundGroupsComponent = ({ peoplesService, syncDown, className }: GroupsComponentProps) => {
  const { appState, appDispatch } = useAppContext();
  const { t } = useTranslation();
  const [peoplesState, peoplesDispatch] = useReducer(PeoplesReducer, initialPeoplesState);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const [mode, setMode] = useState<"none" | "group">("none")
  const notesProviderState = {
    notesState,
    notesDispatch,
  };
  const peoplesProviderState = {
    peoplesState,
    peoplesDispatch,
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

  function editGroup(group: Group) {
    setCurrentGroup(group);
    setShowNewGroupModal(true);
  }

  function createGroup() {
    setCurrentGroup(null);
    setShowNewGroupModal(true);
  }

  async function displayMessages(group: Group) {
    peoplesDispatch({ type: PeoplesActionKind.SetCurrentGroup, payload: group });
    const groupNotes = await NotesService.instance.getGroupNotes(group._id.toString());
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: groupNotes })
    setMode("group")
  }

  function noteClicked(note: Note) {
    syncDown(note.path, note.userId.toString());
    touch(appDispatch, note._id);
  }

  return (
    <PeoplesContext.Provider value={peoplesProviderState}>
      <NotesContext.Provider value={notesProviderState}>
        <>
          {groups && groups.length > 0 ? (
            <div className={`${className} flex flex-col`}>
              {mode === 'none' ?
                <>
                  <div className="flex items-center justify-end w-full h-8 px-2 text-xs">
                    <div className="flex items-center p-1 space-x-1 border rounded-md mr-2px dark:border-obs-modal text-normal" onClick={createGroup}>
                      <PlusIcon className="w-4 h-4" /> <span className="py-0">{t('new_group')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1px w-xl">
                    {groups.map((group: Group) => {
                      return (
                        <SekundGroupSummary
                          key={group._id.toString()}
                          group={group} handleNoteClicked={noteClicked}
                          editGroup={editGroup} />
                      );
                    })}
                  </div>
                </>
                :
                <NoteSummariesPanel context="groups" handleNoteClicked={noteClicked} />
              }
            </div>
          )
            : (
              <div className={`${className} absolute inset-0 flex flex-col items-center justify-center p-8`}>
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