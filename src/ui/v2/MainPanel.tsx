import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import AddUser from "@/ui/common/AddUser";
import SekundSettings from "@/ui/settings/SekundSettings";
import AccordionPanel from "@/ui/v2/AccordionPanel";
import ContactsMgmt from "@/ui/v2/contacts/ContactsMgmt";
import NoteSharing from "@/ui/v2/sharing/NoteSharing";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { BellIcon, GlobeAltIcon, ShareIcon, UsersIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import * as React from "react";
import { useState } from "react";

export type MainPanelProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  notesService: NotesService | undefined;
  syncDown: (id: ObjectID, userId: string) => void;
  noLocalFile: (note: Note) => void;
  syncUp: () => void;
  unpublish: () => void;
};

export const MainPanel = (props: MainPanelProps) => {
  const { appState } = useAppContext();
  const { userProfile } = appState;
  const [showSettings, setShowSettings] = useState(false);
  const [addUser, setAddUser] = useState(false);

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

  return (
    <>
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        <AccordionPanel
          className={map[AccordionIds.Notifications] ? "flex-grow" : "flex-shrink-0"}
          title="Notifications"
          icon={<BellIcon className="w-4 h-4" />}
          setOpen={setOpen}
          id={AccordionIds.Notifications}
          open={map[AccordionIds.Notifications]}
        >
          Notifications
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
          <ContactsMgmt active={map[AccordionIds.Contacts]} addUser={() => setAddUser(true)} showSettings={() => setShowSettings(true)} {...props} />
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
          <a className="mt-8 text-center cursor-pointer hover:underline" href="https://sekund.io/docs">
            Documentation
          </a>
        ) : null}
      </div>
      {showSettings ? (
        <div className="absolute inset-0 z-30 grid h-full overflow-hidden bg-obs-primary">
          <SekundSettings close={() => setShowSettings(false)} />
        </div>
      ) : null}
      {addUser ? (
        <div className="absolute inset-0 z-30 grid h-full overflow-hidden bg-obs-primary">
          <AddUser done={() => setAddUser(false)} />
        </div>
      ) : null}
    </>
  );
};

export default (props: MainPanelProps) => withConnectionStatus(props)(MainPanel);
