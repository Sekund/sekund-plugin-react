import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import { SharingPermission } from "@/domain/SharingPermission";
import { useAppContext } from "@/state/AppContext";
import AddUser from "@/ui/common/AddUser";
import DataCollectionConsentCTA from "@/ui/common/DataCollectionConsentCTA";
import GroupEditModal from "@/ui/groups/GroupEditModal";
import SekundSettings from "@/ui/settings/SekundSettings";
import ContactEditModal from "@/ui/v2/contacts/ContactEditModal";
import MainPanel, { MainPanelProps } from "@/ui/v2/MainPanel";
import withConnectionStatus from "@/ui/withConnectionStatus";
import React, { useState } from "react";

export type ContactsMgmtCallbacks = {
  addUser: () => void;
  showSettings: () => void;
  createGroup: (refresh: () => void) => void;
  closeGroupEditDialog: () => void;
  editPerson: (person: People, permission: SharingPermission, refresh: () => void) => void;
  closeContactDisplayModal: () => void;
  editGroup: (group: Group, refresh: () => void) => void;
  openGroupIndex: (group: Group) => void;
  openPersonIndex: (person: People) => void;
};

export function MainPanelWrapper(props: MainPanelProps) {
  const { appState, appDispatch } = useAppContext();
  const [showSettings, setShowSettings] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [showGroupEditModal, setShowGroupEditModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [showContactDisplayModal, setShowContactDisplayModal] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<People | null>(null);
  const [showConsentCTA, setShowConsentCTA] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<SharingPermission>();

  React.useEffect(() => {
    if (appState.userProfile.consentedToTrackBehaviouralDataInOrderToImproveTheProduct === undefined) {
      setShowConsentCTA(true);
    }
  }, []);

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
    editPerson: (person: People, permission: SharingPermission, refresh: () => void) => {
      setCurrentPerson(person);
      setCurrentPermission(permission);
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
      if (appState.plugin) {
        appState.plugin.openIndexFile("group", group._id.toString());
      }
    },
    openPersonIndex: (person: People) => {
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
      return <ContactEditModal permission={currentPermission!} closeDialog={callbacks.closeContactDisplayModal} person={currentPerson} />;
    } else {
      return null;
    }
  }

  const mainPanelProps = {...props};
  
  (mainPanelProps as unknown as any).callbacks = callbacks;
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {showConsentCTA ? <DataCollectionConsentCTA dismiss={() => setShowConsentCTA(false)} /> : null}
      <MainPanel {...mainPanelProps} />
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
    </div>
  )
}

export default (props: MainPanelProps) => withConnectionStatus(props)(MainPanelWrapper);
