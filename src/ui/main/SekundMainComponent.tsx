import { Note } from "@/domain/Note";
import { SharingPermission } from "@/domain/SharingPermission";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import PermissionsService from "@/services/PermissionsService";
import { useAppContext } from "@/state/AppContext";
import { AppActionKind, filterNoteOutOfUnreadNotes } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import { AccentedBadge } from "@/ui/common/Badges";
import DataCollectionConsentCTA from "@/ui/common/DataCollectionConsentCTA";
import { HeightAdjustable, HeightAdjustableHandle } from "@/ui/common/HeightAdjustable";
import SekundContacts from "@/ui/contacts/SekundContacts";
import { SekundGroupsComponent } from "@/ui/groups/SekundGroupsComponent";
import { SekundHomeComponent } from "@/ui/home/SekundHomeComponent";
import { SekundNoteComponent } from "@/ui/note/SekundNoteComponent";
import { SekundPeoplesComponent } from "@/ui/peoples/SekundPeoplesComponent";
import SekundSettings from "@/ui/settings/SekundSettings";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid, touch } from "@/utils";
import { CloudUploadIcon, CogIcon, InboxInIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type MainComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  notesService: NotesService | undefined;
  syncDown: (id: ObjectID, userId: string) => void;
  noLocalFile: (note: Note) => void;
  syncUp: () => void;
  unpublish: () => void;
};

export type ViewType = "home" | "peoples" | "groups";

export const usePrevious = <T extends unknown>(value: T): T | undefined => {
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
  const [sharingPermissionRequests, setSharingPermissionRequests] = useState<SharingPermission[]>([]);
  const [sharingPermissions, setSharingPermissions] = useState<SharingPermission[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showConsentCTA, setShowConsentCTA] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
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
    const betterProps = { ...props };
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
    const permissionsListenerId = makeid(5);
    const unreadNotesListenerId = makeid(5);

    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(permissionsListenerId, new SekundEventListener(["permissions.changed"], loadPermissions));
    eventsWatcher?.addEventListener(listenerId, new SekundEventListener(["note.addComment"], filterIncomingChanges));
    eventsWatcher?.addEventListener(
      unreadNotesListenerId,
      new SekundEventListener(["unreadChanged"], () => {
        fetchUnread();
      })
    );

    fetchUnread();
    loadPermissions();

    if (appState.userProfile.consentedToTrackBehaviouralDataInOrderToImproveTheProduct === undefined) {
      setShowConsentCTA(true);
    }

    return () => {
      eventsWatcher?.removeEventListener(unreadNotesListenerId);
      eventsWatcher?.removeEventListener(permissionsListenerId);
      eventsWatcher?.removeEventListener(listenerId);
    };
  }, []);

  async function loadPermissions() {
    const permissions = await PermissionsService.instance.getPermissions();
    setSharingPermissionRequests(permissions.filter((p) => p.status === "requested" && p.userId.equals(appState.userProfile._id)));
    setSharingPermissions(permissions);
  }

  async function filterIncomingChanges(fullDocument: any) {
    const updtNote: Note = fullDocument.data;
    if (GlobalState.instance.appState.remoteNote && updtNote._id.equals(GlobalState.instance.appState.remoteNote._id)) {
      // immediately update read timestamp if the notification pertains to
      // the currently open note
      await touch(appDispatch, updtNote);
    }
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
      {showSettings ? (
        <div className="absolute inset-0 z-30 grid h-full overflow-hidden bg-obs-primary">
          <SekundSettings close={() => setShowSettings(false)} />
        </div>
      ) : null}
      {showPermissions ? (
        <div className="absolute inset-0 z-30 grid h-full overflow-hidden bg-obs-primary">
          <SekundContacts close={() => setShowPermissions(false)} permissions={sharingPermissions} />
        </div>
      ) : null}
      <div ref={sekundMainComponentRoot} className="absolute inset-0 grid h-full" style={{ gridTemplateRows: "auto 1fr auto" }}>
        {showConsentCTA ? <DataCollectionConsentCTA dismiss={() => setShowConsentCTA(false)} /> : null}
        <div className={`flex items-center justify-between w-full py-1`}>
          <div className="flex flex-col items-center mt-1 ml-2">
            <div className="flex items-center" onClick={showViewTypes}>
              <div
                onClick={() => {
                  setViewType("home");
                  setShowViews(false);
                }}
                aria-label={t("yourNotes")}
                className={`flex items-center px-2 mr-0 space-x-2 rounded-none text-obs-muted hover:opacity-100  ${
                  viewType === "home" ? "opacity-100" : "opacity-50"
                } cursor-pointer`}
              >
                {unreadNotes.home.length > 0 ? (
                  <AccentedBadge
                    badgeContent={unreadNotes.home.length}
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <CloudUploadIcon className="w-6 h-6" />
                  </AccentedBadge>
                ) : (
                  <CloudUploadIcon className="w-6 h-6" />
                )}
              </div>
              <div
                onClick={() => {
                  setViewType("peoples");
                  setShowViews(false);
                }}
                aria-label={t("yourContactsNotes")}
                className={`flex items-center pr-2 mr-0 space-x-2 rounded-none text-obs-muted hover:opacity-100 ${
                  viewType === "peoples" ? "opacity-100" : "opacity-50"
                } cursor-pointer`}
              >
                {unreadNotes.peoples.length > 0 ? (
                  <AccentedBadge
                    badgeContent={unreadNotes.peoples.length}
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <InboxInIcon className="w-6 h-6" />
                  </AccentedBadge>
                ) : (
                  <InboxInIcon className="w-6 h-6" />
                )}
              </div>
              <div
                onClick={() => {
                  setViewType("groups");
                  setShowViews(false);
                }}
                aria-label={t("groupNotes")}
                className={`flex items-center mr-0 space-x-2 rounded-none text-obs-muted hover:opacity-100 ${
                  viewType === "groups" ? "opacity-100" : "opacity-50"
                } cursor-pointer`}
              >
                {unreadNotes.groups.length > 0 ? (
                  <AccentedBadge
                    badgeContent={`${unreadNotes.groups.length}`}
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <UserGroupIcon className="w-6 h-6" />
                  </AccentedBadge>
                ) : (
                  <UserGroupIcon className="w-6 h-6" />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-1 mr-2">
            <div className="flex items-center space-x-2">
              {/* <div className="flex items-center" onClick={showTeamsMenu}>
              <span>{appState.plugin?.settings.subdomain}</span>
              <ChevronDownIcon className="w-6 h-6" />
            </div> */}
              <div className="flex items-center mr-0 rounded-none cursor-pointer text-obs-muted" onClick={() => setShowPermissions(true)}>
                <div className="flex flex-col">
                  <UsersIcon aria-label={t("yourContacts")} className="w-6 h-6 opacity-50 text-obs-muted hover:opacity-100" />
                  <div
                    className={`w-6 h-1 border-2 border-solid rounded-sm border-accent-3 ${
                      sharingPermissionRequests && sharingPermissionRequests.length > 0 ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                </div>
              </div>
              <div className="flex items-center mr-0 rounded-none cursor-pointer text-obs-muted" onClick={() => setShowSettings(true)}>
                <CogIcon aria-label={t("settings")} className="w-6 h-6 opacity-50 text-obs-muted hover:opacity-100" />
              </div>
            </div>
            {/* {showTeams ? (
            <Popover className="relative">
              <Popover.Panel className="absolute z-20 right-1" static>
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

        <div ref={viewRef} className="overflow-auto">
          {getViewTypeView()}
        </div>

        <HeightAdjustable parentComponent={sekundMainComponentRoot}>
          <HeightAdjustableHandle />
          <div className="h-full overflow-auto bg-obs-primary">
            <SekundNoteComponent {...props} />
          </div>
        </HeightAdjustable>
      </div>
    </>
  );
};

export default (props: MainComponentProps) => withConnectionStatus(props)(SekundMainComponent);
