import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import AccordionPanel from "@/ui/v2/AccordionPanel";
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

  const [map, setMap] = useState<{ [key: string]: boolean }>({
    notifications: false,
    contacts: false,
    share: true,
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

  return (
    <div>
      <AccordionPanel
        title="Notifications"
        icon={<BellIcon className="w-4 h-4" />}
        setOpen={setOpen}
        id={AccordionIds.Notifications}
        open={map[AccordionIds.Notifications]}
      >
        Notifications
      </AccordionPanel>
      <AccordionPanel title="Share" icon={<ShareIcon className="w-4 h-4" />} setOpen={setOpen} id={AccordionIds.Share} open={map[AccordionIds.Share]}>
        <NoteSharing active={map[AccordionIds.Share]} userId={userProfile._id} {...props} />
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
        title="Contacts"
        icon={<UsersIcon className="w-4 h-4" />}
        setOpen={setOpen}
        id={AccordionIds.Contacts}
        open={map[AccordionIds.Contacts]}
      >
        Contacts
      </AccordionPanel>
    </div>
  );
};

export default (props: MainPanelProps) => withConnectionStatus(props)(MainPanel);
