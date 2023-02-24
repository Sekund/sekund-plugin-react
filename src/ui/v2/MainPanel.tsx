import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import AddUser from "@/ui/common/AddUser";
import GroupEditModal from "@/ui/groups/GroupEditModal";
import SekundSettings from "@/ui/settings/SekundSettings";
import AccordionPanel from "@/ui/v2/AccordionPanel";
import ContactEditModal from "@/ui/v2/contacts/ContactEditModal";
import ContactsMgmt from "@/ui/v2/contacts/ContactsMgmt";
import NoteSharing from "@/ui/v2/sharing/NoteSharing";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { BellIcon, ShareIcon, UsersIcon } from "@heroicons/react/solid";
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

export type ContactsMgmtCallbacks = {
  addUser: () => void;
  showSettings: () => void;
  createGroup: (refresh: () => void) => void;
  closeGroupEditDialog: () => void;
  editPerson: (person: People, refresh: () => void) => void;
  closeContactDisplayModal: () => void;
  editGroup: (group: Group, refresh: () => void) => void;
  openGroupIndex: (group: Group) => void;
  openPersonIndex: (person: People) => void;
};

export const MainPanel = (props: MainPanelProps) => {
  const { appState } = useAppContext();
  const { userProfile } = appState;
  const [showSettings, setShowSettings] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [showGroupEditModal, setShowGroupEditModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [showContactDisplayModal, setShowContactDisplayModal] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<People | null>(null);

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

  const callbacks: ContactsMgmtCallbacks = {
    addUser: () => {
      setAddUser(true);
    },
    showSettings: () => {
      setShowSettings(true);
    },
    createGroup: (refresh: () => void) => {
      setCurrentGroup(null);
      setShowGroupEditModal(true);
      refresh();
    },
    closeGroupEditDialog: () => {
      setShowGroupEditModal(false);
    },
    editPerson: (person: People, refresh: () => void) => {
      setCurrentPerson(person);
      setShowContactDisplayModal(true);
    },
    closeContactDisplayModal: () => {
      setShowContactDisplayModal(false);
    },
    editGroup: (group: Group, refresh: () => void) => {
      setCurrentGroup(group);
      setShowGroupEditModal(true);
    },
    openGroupIndex: async (group: Group) => {
      console.log("openGroupIndex", group);
      if (appState.plugin) {
        appState.plugin.openIndexFile("group", group._id.toString());
      }
    },
    openPersonIndex: (person: People) => {
      console.log("openPersonIndex", person);
      if (appState.plugin) {
        appState.plugin.openIndexFile("contact", person._id.toString());
      }
    },
  };

  function GroupEditDialog() {
    if (showGroupEditModal) {
      return (
        <GroupEditModal
          userId={appState.userProfile._id}
          open={showGroupEditModal}
          closeDialog={callbacks.closeGroupEditDialog}
          group={currentGroup}
        />
      );
    } else {
      return null;
    }
  }

  function ContactEditDialog() {
    if (showContactDisplayModal && currentPerson) {
      return <ContactEditModal closeDialog={callbacks.closeContactDisplayModal} person={currentPerson} />;
    } else {
      return null;
    }
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
      {showGroupEditModal ? <GroupEditDialog /> : null}
      {showContactDisplayModal ? <ContactEditDialog /> : null}
    </>
  );
};

export default (props: MainPanelProps) => withConnectionStatus(props)(MainPanel);
