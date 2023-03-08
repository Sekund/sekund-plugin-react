import { Note } from "@/domain/Note";
import { SharingPermission } from "@/domain/SharingPermission";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { filterNoteOutOfUnreadNotes } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import { AccentedBadge } from "@/ui/common/Badges";
import AccordionPanel from "@/ui/v2/AccordionPanel";
import ContactsMgmt from "@/ui/v2/contacts/ContactsMgmt";
import { ContactsMgmtCallbacks } from "@/ui/v2/MainPanelWrapper";
import Notifications from "@/ui/v2/notifications/Notifications";
import NoteSharing from "@/ui/v2/sharing/NoteSharing";
import UpdatesContext from "@/ui/v2/state/UpdatesContext";
import UpdatesReducer, { initialUpdatesState, Update, UpdatesActionKind } from "@/ui/v2/state/UpdatesReducer";
import { makeid, touch } from "@/utils";
import { BellIcon, ShareIcon, UsersIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import * as React from "react";
import { useReducer, useState } from "react";

export type MainPanelProps = {
  view: { addAppDispatch: Function };
  syncDown: (id: ObjectID, userId: string) => void;
  noLocalFile: (note: Note) => void;
  syncUp: () => void;
  unpublish: () => void;
};

export default function MainPanel(props: MainPanelProps, callbacks: ContactsMgmtCallbacks) {
  const { appState, appDispatch } = useAppContext();
  const { userProfile } = appState;

  const [updatesState, updatesDispatch] = useReducer(UpdatesReducer, initialUpdatesState);
  const updatesProviderState = {
    updatesState,
    updatesDispatch,
  };
  const { updates } = updatesState;

  const [map, setMap] = useState<{ [key: string]: boolean }>({
    notifications: false,
    contacts: true,
    share: false,
    publish: false,
  });

  const enum AccordionIds {
    Notifications = "notifications",
    Contacts = "contacts",
    Share = "share",
    Publish = "publish",
  }

  React.useEffect(() => {
    const listenerId = makeid(5);
    const permissionsListenerId = makeid(5);
    const unreadNotesListenerId = makeid(5);

    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(listenerId, new SekundEventListener(["note.addComment"], filterIncomingChanges));
    eventsWatcher?.addEventListener(
      unreadNotesListenerId,
      new SekundEventListener(["unreadChanged"], () => {
        fetchUnread();
      })
    );

    fetchUnread();

    return () => {
      eventsWatcher?.removeEventListener(unreadNotesListenerId);
      eventsWatcher?.removeEventListener(permissionsListenerId);
      eventsWatcher?.removeEventListener(listenerId);
    };
  }, []);

  function addUpdate(data: Note | SharingPermission, type: "permissionRequest" | "permissionGranted" | "note") {
    const update: Update = {
      id: data._id.toString(),
      data,
      type,
      time: data.updated,
    };
    updatesDispatch({ type: UpdatesActionKind.AddUpdate, update });
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
    filteredUnreadNotes.all.forEach((n: Note) => {
      addUpdate(n, "note");
    });
  }

  function setOpen(id: string) {
    const updtMap = { ...map };
    Object.keys(updtMap).forEach((key) => {
      if (key === id) {
        updtMap[key] = !updtMap[key];
      } else {
        updtMap[key] = false;
      }
    });
    setMap(updtMap);
  }

  function allAccordionsAreClosed() {
    return Object.values(map).every((value) => !value);
  }

  function NotificationsTitle() {
    return updates.length > 0 ? (
      <AccentedBadge
        badgeContent={updates.length}
        overlap="circular"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="mr-2 text-base">Notifications</div>
      </AccentedBadge>
    ) : (
      <div className="mr-2 text-base text-obs-faint">Notifications</div>
    );
  }

  return (
    <>
      <AccordionPanel
        className={map[AccordionIds.Notifications] ? "flex-grow" : "flex-shrink-0"}
        title={<NotificationsTitle />}
        icon={<BellIcon className="w-4 h-4" />}
        setOpen={setOpen}
        id={AccordionIds.Notifications}
        open={map[AccordionIds.Notifications]}
      >
        <UpdatesContext.Provider value={updatesProviderState}>
          <Notifications />
        </UpdatesContext.Provider>
      </AccordionPanel>
      {/* <AccordionPanel
        title="Blog"
        icon={<GlobeAltIcon className="w-4 h-4" />}
        setOpen={setOpen}
        id={AccordionIds.Publish}
        open={map[AccordionIds.Publish]}
      >
        Blog
      </AccordionPanel> */}
      <AccordionPanel
        className={map[AccordionIds.Contacts] ? "flex-grow" : "flex-shrink-0"}
        title="Contacts"
        icon={<UsersIcon className="w-4 h-4" />}
        setOpen={setOpen}
        id={AccordionIds.Contacts}
        open={map[AccordionIds.Contacts]}
      >
        <ContactsMgmt active={map[AccordionIds.Contacts]} callbacks={callbacks} {...props} />
      </AccordionPanel>
      <AccordionPanel
        className={map[AccordionIds.Share] ? "flex-grow" : "flex-shrink-0"}
        title="Share"
        icon={<ShareIcon className="w-4 h-4" />}
        setOpen={setOpen}
        id={AccordionIds.Share}
        open={map[AccordionIds.Share]}
      >
        <NoteSharing active={map[AccordionIds.Share]} userId={userProfile._id} {...props} />
      </AccordionPanel>

      {allAccordionsAreClosed() ? (
        <a className="mt-8 text-center cursor-pointer hover:underline" href="https://sekund-www.vercel.app/roadmap">
          Documentation
        </a>
      ) : null}
    </>
  )
}
