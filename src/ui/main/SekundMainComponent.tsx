import { Note } from "@/domain/Note";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import { AppActionKind, filterNoteOutOfUnreadNotes } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import { BlueBadge, GreenBadge, OrangeBadge } from "@/ui/common/Badges";
import { HeightAdjustable, HeightAdjustableHandle } from "@/ui/common/HeightAdjustable";
import { SekundGroupsComponent } from "@/ui/groups/SekundGroupsComponent";
import { SekundHomeComponent } from "@/ui/home/SekundHomeComponent";
import { SekundNoteComponent } from "@/ui/note/SekundNoteComponent";
import { SekundPeoplesComponent } from "@/ui/peoples/SekundPeoplesComponent";
import SekundSettings from "@/ui/settings/SekundSettings";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid, touch } from "@/utils";
import { CloudUploadIcon, CogIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type MainComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  notesService: NotesService | undefined;
  syncDown: (id: ObjectID, userId: string) => void;
  syncUp: () => void;
  unpublish: () => void;
};

export type ViewType = "home" | "peoples" | "groups";

const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const SekundMainComponent = (props: MainComponentProps) => {
  const { t } = useTranslation(["common", "plugin"]);

  const { appState, appDispatch } = useAppContext();
  const [, setShowViews] = useState(false);
  const [settings, setSettings] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("home");
  const scrollPositions = useRef({ home: 0, groups: 0, peoples: 0 });
  const previousView = usePrevious(viewType);
  const viewRef = useRef<any>();
  const { unreadNotes } = appState;
  const sekundMainComponentRoot = useRef<HTMLDivElement>(null);

  function getViewTypeView() {
    if (previousView) {
      scrollPositions.current[previousView] = viewRef.current?.scrollTop;
    }
    setTimeout(() => {
      const savedScrollPosition = scrollPositions.current[viewType];
      viewRef.current.scrollTop = savedScrollPosition ? scrollPositions.current[viewType] : 0;
    }, 10);
    const betterProps = { ...props, fetchUnread };
    return (
      <>
        <SekundHomeComponent className={`${viewType !== "home" ? "hidden" : ""}`} {...betterProps} />
        <SekundPeoplesComponent className={`${viewType !== "peoples" ? "hidden" : ""}`} {...betterProps} />
        <SekundGroupsComponent className={`${viewType !== "groups" ? "hidden" : ""}`} {...betterProps} />
      </>
    );
  }

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(
      listenerId,
      new SekundEventListener(["note.addComment", "note.editComment", "note.removeComment"], filterIncomingChanges)
    );
    fetchUnread();
    return () => {
      eventsWatcher?.removeEventListener(listenerId);
    };
  }, []);

  async function filterIncomingChanges(fullDocument: any) {
    const updtNote: Note = fullDocument.data;
    if (GlobalState.instance.appState.remoteNote && updtNote._id.equals(GlobalState.instance.appState.remoteNote._id)) {
      // immediately update read timestamp if the notification pertains to
      // the currently open note
      await touch(appDispatch, updtNote);
    }
    fetchUnread();
  }

  async function fetchUnread() {
    const unreadNotes = await NotesService.instance.getUnreadNotes();
    const { remoteNote } = GlobalState.instance.appState;
    const filteredUnreadNotes = remoteNote ? filterNoteOutOfUnreadNotes(unreadNotes, remoteNote._id) : unreadNotes;
    appDispatch({ type: AppActionKind.SetUnreadNotes, payload: filteredUnreadNotes });
  }

  function showViewTypes(evt: any) {
    setShowViews(true);
    const hideViewTypes = () => {
      setShowViews(false);
      document.removeEventListener("click", hideViewTypes);
    };
    document.addEventListener("click", hideViewTypes);
    evt.stopPropagation();
  }

  return (
    <>
      {settings ? (
        <div className="fixed inset-0 z-30 grid h-screen bg-obs-primary">
          <SekundSettings close={() => setSettings(false)} />
        </div>
      ) : null}
      <div ref={sekundMainComponentRoot} className="fixed inset-0 grid h-full" style={{ gridTemplateRows: "auto 1fr auto" }}>
        <div className={`flex items-center justify-between w-full py-1`}>
          <div className="flex flex-col items-center mt-1 ml-2 text-obs-muted">
            <div className="flex items-center" onClick={showViewTypes}>
              <div
                onClick={() => {
                  setViewType("home");
                  setShowViews(false);
                }}
                className={`flex items-center px-2 mr-0 space-x-2 rounded-none opacity-${viewType === "home" ? "100" : "50"} cursor-pointer`}
              >
                {unreadNotes.home.length > 0 ? (
                  <GreenBadge
                    badgeContent={unreadNotes.home.length}
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <CloudUploadIcon className="w-6 h-6 text-obs-normal" />
                  </GreenBadge>
                ) : (
                  <CloudUploadIcon className="w-6 h-6 text-obs-normal" />
                )}
              </div>
              <div
                onClick={() => {
                  setViewType("peoples");
                  setShowViews(false);
                }}
                className={`flex items-center pr-2 mr-0 space-x-2 rounded-none opacity-${viewType === "peoples" ? "100" : "50"} cursor-pointer`}
              >
                {unreadNotes.peoples.length > 0 ? (
                  <BlueBadge
                    badgeContent={unreadNotes.peoples.length}
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <UsersIcon className="w-6 h-6 text-obs-normal" />
                  </BlueBadge>
                ) : (
                  <UsersIcon className="w-6 h-6 text-obs-normal" />
                )}
              </div>
              <div
                onClick={() => {
                  setViewType("groups");
                  setShowViews(false);
                }}
                className={`flex items-center mr-0 space-x-2 rounded-none opacity-${viewType === "groups" ? "100" : "50"} cursor-pointer`}
              >
                {unreadNotes.groups.length > 0 ? (
                  <OrangeBadge
                    badgeContent={unreadNotes.groups.length}
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <UserGroupIcon className="w-6 h-6 text-obs-normal" />
                  </OrangeBadge>
                ) : (
                  <UserGroupIcon className="w-6 h-6 text-obs-normal" />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-1 mr-2 text-obs-muted">
            <div className="flex items-center">
              {/* <div className="flex items-center" onClick={showTeamsMenu}>
              <span>{appState.plugin?.settings.subdomain}</span>
              <ChevronDownIcon className="w-6 h-6" />
            </div> */}
              <div className="cursor-pointer" onClick={() => setSettings(true)}>
                <CogIcon className="w-6 h-6" />
              </div>
            </div>
            {/* {showTeams ? (
            <Popover className="relative">
              <Popover.Panel className="fixed z-20 right-1" static>
                <div className="flex flex-col">
                  {Object.keys(appState.plugin?.settings.apiKeys || {}).map((subdomain) => {
                    return (
                      <button
                        onClick={() => showApiKeyModal(subdomain)}
                        key={subdomain}
                        className="flex items-center px-2 py-2 mr-0 space-x-2 truncate border-t rounded-none"
                      >
                        <span>{subdomain}</span>
                      </button>
                    );
                  })}
                  <button onClick={() => showApiKeyModal(null)} className="flex items-center px-2 py-2 mr-0 space-x-2 truncate border-t rounded-none">
                    <PlusIcon className="w-6 h-6" />
                    <span>{t("addWorkspace")}</span>
                  </button>
                </div>
              </Popover.Panel>
            </Popover>
          ) : null} */}
          </div>
        </div>

        <div ref={viewRef} className="relative overflow-auto">
          {getViewTypeView()}
        </div>

        <HeightAdjustable initialHeight={400} parentComponent={sekundMainComponentRoot}>
          <HeightAdjustableHandle />
          <div className="relative h-full overflow-auto bg-obs-primary">
            <SekundNoteComponent {...props} />
          </div>
        </HeightAdjustable>
      </div>
    </>
  );
};

export default (props: MainComponentProps) => withConnectionStatus(props)(SekundMainComponent);
