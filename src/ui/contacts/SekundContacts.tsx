import { PermissionRequestStatus, SharingPermission } from "@/domain/SharingPermission";
import PermissionsService from "@/services/PermissionsService";
import { useAppContext } from "@/state/AppContext";
import AddUser from "@/ui/common/AddUser";
import PermissionSummaryComponent from "@/ui/contacts/ContactSummaryComponent";
import { EyeIcon, EyeOffIcon, PlusIcon, SparklesIcon, UsersIcon, XIcon } from "@heroicons/react/solid";
import { t } from "i18next";
import React, { useEffect, useState } from "react";

type Props = {
  close: () => void;
  permissionsService?: PermissionsService;
  permissions: SharingPermission[];
};

export default function SekundContacts({ close, permissionsService, permissions }: Props) {
  const [incomingRequests, setIncomingRequests] = useState<SharingPermission[]>();
  const [outgoingRequests, setOutgoingRequests] = useState<SharingPermission[]>();
  const [acceptedContacts, setAcceptedContacts] = useState<SharingPermission[]>();
  const [blockedContacts, setBlockedContacts] = useState<SharingPermission[]>();
  const [showBlocked, setShowBlocked] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const { appState } = useAppContext();

  useEffect(() => {
    setIncomingRequests(permissions.filter((p) => p.status === "requested" && p.userId.equals(appState.userProfile._id)));
    setOutgoingRequests(permissions.filter((p) => p.status === "requested" && p.user && p.user._id.equals(appState.userProfile._id)));
    setAcceptedContacts(permissions.filter((p) => p.status === "accepted"));
    setBlockedContacts(permissions.filter((p) => p.status === "blocked"));
  }, [permissions]);

  async function setStatus(sp: SharingPermission, status: PermissionRequestStatus) {
    if (!permissionsService) {
      permissionsService = PermissionsService.instance;
    }
    await permissionsService.setStatus(sp, status);
  }

  function sortItems(a: SharingPermission, b: SharingPermission): number {
    return itemName(a).localeCompare(itemName(b));
  }

  function itemName(i: SharingPermission): string {
    if (i.user) {
      return (i.user.name ? i.user.name : i.user.email) || "";
    }
    if (i.group) {
      return i.group.name;
    }
    return "";
  }

  function Permissions(filteredPermissions?: SharingPermission[]) {
    if (filteredPermissions && filteredPermissions.length > 0) {
      return (
        <>
          {filteredPermissions
            .sort((a, b) => sortItems(a, b))
            .map((r) => (
              <React.Fragment key={r._id.toString()}>
                <PermissionSummaryComponent sharingPermission={r} setStatus={setStatus} />
              </React.Fragment>
            ))}
        </>
      );
    }
    return null;
  }

  function createContact() {
    setAddUser(true);
  }

  if (addUser) {
    return <AddUser done={() => setAddUser(false)} />;
  }

  return (
    <div className="relative flex flex-col w-full px-2">
      <div className="relative flex justify-center py-1 mt-1 space-x-1 text-lg text-obs-muted">
        <UsersIcon className="w-6 h-6" />
        <span>{t("yourContacts")}</span>
        <XIcon className="absolute w-6 h-6 cursor-pointer right-1 top-1" onClick={close} />
      </div>
      <div className="flex flex-col w-full">{Permissions(incomingRequests)}</div>
      {(acceptedContacts && acceptedContacts.length > 0) ||
      (outgoingRequests && outgoingRequests.length > 0) ||
      (blockedContacts && blockedContacts.length > 0) ? (
        <div className="flex items-center justify-end w-full h-8 px-1 mt-1 text-xs">
          <div
            className="flex items-center space-x-1 border rounded-md cursor-pointer mr-2px dark:border-obs-modal text-normal"
            onClick={createContact}
          >
            <PlusIcon className="w-4 h-4" /> <span>{t("newContact")}</span>
          </div>
        </div>
      ) : null}
      {(acceptedContacts && acceptedContacts.length > 0) ||
      (outgoingRequests && outgoingRequests.length > 0) ||
      (blockedContacts && blockedContacts.length > 0) ? (
        <>
          <div className="flex flex-col mt-2">{Permissions(outgoingRequests)}</div>
          <div className="flex flex-col mt-2">{Permissions(acceptedContacts)}</div>
          {blockedContacts && blockedContacts.length > 0 ? (
            <div className="flex flex-col mt-2">
              <div
                onClick={() => setShowBlocked(!showBlocked)}
                className={`cursor-pointer flex px-2 items-center justify-between ${
                  showBlocked ? "text-obs-muted" : "text-obs-faint hover:text-obs-muted"
                }`}
              >
                <div className="">Blocked contacts</div>
                <div>{showBlocked ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}</div>
              </div>
              {showBlocked ? Permissions(blockedContacts) : null}
            </div>
          ) : null}
        </>
      ) : (
        <div className="absolute inset-x-0 flex flex-col items-center justify-center p-8" style={{ top: "100px" }}>
          <>
            <div className="flex justify-center mb-2">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <div className="text-center ">{t("noContacts")}</div>
            <div className="mt-2 text-sm text-center ">{t("noContactsDesc")}</div>
            <button className="flex items-center mt-2 mr-0 cursor-pointer mod-cta" onClick={createContact}>
              <PlusIcon className="w-4 h-4" /> <span>{t("newContact")}</span>
            </button>
          </>
        </div>
      )}
    </div>
  );
}
