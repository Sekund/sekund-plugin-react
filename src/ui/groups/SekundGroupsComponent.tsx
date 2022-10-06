import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState } from "@/state/NotesReducer";
import PeoplesContext from "@/state/PeoplesContext";
import PeoplesReducer, { initialPeoplesState, PeoplesActionKind } from "@/state/PeoplesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import GroupDisplayModal from "@/ui/groups/GroupDisplayModal";
import GroupEditModal from "@/ui/groups/GroupEditModal";
import SekundGroupSummary from "@/ui/groups/SekundGroupSummary";
import SekundPublicGroupSummary from "@/ui/groups/SekundPublicGroupSummary";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid, touch } from "@/utils";
import { ArrowNarrowLeftIcon, PlusIcon, SearchIcon, SparklesIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

export type GroupsComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  syncDown: (id: ObjectID, userId: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const SekundGroupsComponent = ({ peoplesService, syncDown, className }: GroupsComponentProps) => {
  const { appState, appDispatch } = useAppContext();
  const { t } = useTranslation();
  const [peoplesState, peoplesDispatch] = useReducer(PeoplesReducer, initialPeoplesState);
  const [showPublicGroups, setShowPublicGroups] = useState(false);
  const [showGroupEditModal, setShowGroupEditModal] = useState(false);
  const [showGroupDisplayModal, setShowGroupDisplayModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const [mode] = useState<"none" | "group">("none");
  const notesProviderState = {
    notesState,
    notesDispatch,
  };
  const peoplesProviderState = {
    peoplesState,
    peoplesDispatch,
  };

  const { groups } = peoplesState;

  async function fetchUserGroups() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }
    const groups = await peoplesService.getUserGroups();
    peoplesDispatch({ type: PeoplesActionKind.SetGroups, payload: groups });
    return groups;
  }

  async function fetchPublicGroups() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }
    const groups = await peoplesService.getPublicGroups();
    peoplesDispatch({ type: PeoplesActionKind.SetGroups, payload: groups });
  }

  function renderGroupEditDialog() {
    if (showGroupEditModal) {
      return <GroupEditModal userId={appState.userProfile._id} open={showGroupEditModal} closeDialog={closeGroupEditDialog} group={currentGroup} />;
    } else {
      return null;
    }
  }

  function closeGroupEditDialog() {
    setShowGroupEditModal(false);
    fetchUserGroups();
  }

  function closeGroupDisplayDialog() {
    setShowGroupDisplayModal(false);
    fetchUserGroups();
  }

  function renderGroupDisplayDialog() {
    if (showGroupDisplayModal && currentGroup) {
      return <GroupDisplayModal open={showGroupDisplayModal} closeDialog={closeGroupDisplayDialog} group={currentGroup} />;
    } else {
      return null;
    }
  }

  useEffect(() => {
    if (appState.generalState === "allGood") {
      (async () => {
        watchEvents();
        const userGroups = await fetchUserGroups();
        if (userGroups.length === 0) {
          displayPublicGroups();
        }
      })();
    }
  }, [appState.generalState]);

  async function watchEvents() {
    if (!appState.plugin) {
      return;
    }
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(
      listenerId,
      new SekundEventListener(["group.add", "group.upsert", "group.delete"], async () => {
        showPublicGroups ? await fetchUserGroups() : await fetchPublicGroups();
      })
    );
    return () => {
      eventsWatcher?.removeEventListener(listenerId);
    };
  }

  function editGroup(group: Group) {
    setCurrentGroup(group);
    setShowGroupEditModal(true);
  }

  function displayGroup(group: Group) {
    setCurrentGroup(group);
    setShowGroupDisplayModal(true);
  }

  function createGroup() {
    setCurrentGroup(null);
    setShowGroupEditModal(true);
  }

  function noteClicked(note: Note) {
    syncDown(note._id, note.userId.toString());
    touch(appDispatch, note);
  }

  async function displayUserGroups() {
    await fetchUserGroups();
    setShowPublicGroups(false);
  }

  async function displayPublicGroups() {
    await fetchPublicGroups();
    setShowPublicGroups(true);
  }

  function UserGroups() {
    return (
      <div className={`${className} flex flex-col relative`}>
        {mode === "none" ? (
          <>
            <div className="sticky top-0 left-0 right-0 z-10 flex items-center justify-between w-full h-8 px-2 text-xs bg-obs-primary">
              <div
                className="flex items-center p-1 space-x-1 overflow-hidden border rounded-md cursor-pointer mr-2px dark:border-obs-modal text-normal"
                onClick={() => displayPublicGroups()}
              >
                <SearchIcon className="w-4 h-4" /> <span className="py-0 truncate">{t("plugin:browsePublicGroups")}</span>
              </div>
              <div
                className="flex items-center p-1 space-x-1 overflow-hidden border rounded-md cursor-pointer mr-2px dark:border-obs-modal text-normal"
                onClick={createGroup}
              >
                <PlusIcon className="w-4 h-4" /> <span className="py-0 truncate">{t("new_group")}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1px w-xl">
              {groups!.map((group: Group) => {
                return (
                  <SekundGroupSummary
                    key={group._id.toString()}
                    group={group}
                    handleNoteClicked={noteClicked}
                    editGroup={editGroup}
                    displayGroup={displayGroup}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <NoteSummariesPanel context="groups" handleNoteClicked={noteClicked} />
        )}
      </div>
    );
  }

  return (
    <PeoplesContext.Provider value={peoplesProviderState}>
      <NotesContext.Provider value={notesProviderState}>
        <>
          {groups && groups.length > 0 ? (
            showPublicGroups ? (
              <div className={`${className} flex flex-col relative`}>
                <div className="sticky top-0 left-0 right-0 z-10 flex items-center w-full h-8 px-2 text-xs bg-obs-primary">
                  <div
                    className="flex items-center p-1 space-x-1 border rounded-md cursor-pointer mr-2px dark:border-obs-modal text-normal"
                    onClick={() => displayUserGroups()}
                  >
                    <ArrowNarrowLeftIcon className="w-4 h-4" /> <span className="py-0">{t("myGroups")}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1px w-xl">
                  <div className="flex items-center justify-center h-8">{t("joinAPublicGroup")}</div>
                  {groups!.map((group: Group) => {
                    return <SekundPublicGroupSummary key={group._id.toString()} group={group} displayGroup={displayGroup} />;
                  })}
                </div>
              </div>
            ) : (
              <div className={`${className} flex flex-col relative`}>
                {mode === "none" ? (
                  <>
                    <div className="sticky top-0 left-0 right-0 z-10 flex items-center justify-between w-full h-8 px-2 text-xs bg-obs-primary">
                      <div
                        className="flex items-center p-1 space-x-1 border rounded-md cursor-pointer mr-2px dark:border-obs-modal text-normal"
                        onClick={() => displayPublicGroups()}
                      >
                        <SearchIcon className="w-4 h-4" /> <span className="py-0">{t("plugin:browsePublicGroups")}</span>
                      </div>
                      <div
                        className="flex items-center p-1 space-x-1 border rounded-md cursor-pointer mr-2px dark:border-obs-modal text-normal"
                        onClick={createGroup}
                      >
                        <PlusIcon className="w-4 h-4" /> <span className="py-0">{t("new_group")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1px w-xl">
                      {groups!.map((group: Group) => {
                        return (
                          <SekundGroupSummary
                            key={group._id.toString()}
                            group={group}
                            handleNoteClicked={noteClicked}
                            editGroup={editGroup}
                            displayGroup={displayGroup}
                          />
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <NoteSummariesPanel context="groups" handleNoteClicked={noteClicked} />
                )}
              </div>
            )
          ) : (
            <div className={`${className} w-full h-full flex flex-col items-center justify-center p-8`}>
              <div className="flex justify-center mb-2">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div className="text-center ">{t("plugin:noGroups")}</div>
              <div className="mt-2 text-sm text-center ">{t("plugin:noGroupsDesc")}</div>
              <button onClick={createGroup} className="flex items-center mt-2 cursor-pointer mod-cta">
                <PlusIcon className="w-4 h-4 mr-1" />
                <div className="cursor-pointer">{t("new_group")}</div>
              </button>
              <span>{t("or")}</span>
              <span>{t("plugin:browsePublicGroupsDesc")}</span>
              <button onClick={displayPublicGroups} className="flex items-center mt-2 cursor-pointer mod-cta">
                <SearchIcon className="w-4 h-4 mr-1" />
                <div className="cursor-pointer">{t("plugin:browsePublicGroups")}</div>
              </button>
            </div>
          )}
          {renderGroupEditDialog()}
          {renderGroupDisplayDialog()}
        </>
      </NotesContext.Provider>
    </PeoplesContext.Provider>
  );
};

export default (props: GroupsComponentProps) => withConnectionStatus(props)(SekundGroupsComponent);
