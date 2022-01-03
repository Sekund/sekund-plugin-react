import { PermissionRequestStatus, SharingPermission } from "@/domain/SharingPermission";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import PermissionsService from "@/services/PermissionsService";
import PermissionSummaryComponent from "@/ui/contacts/ContactSummaryComponent";
import { makeid } from "@/utils";
import { ExclamationCircleIcon, ShieldCheckIcon, UsersIcon, XIcon } from "@heroicons/react/solid";
import { t } from "i18next";
import React, { useEffect, useState } from "react";

type Props = {
  close: () => void;
  permissionsService?: PermissionsService;
};

export default function SekundPermission({ close, permissionsService }: Props) {
  const [permissions, setPermissions] = useState<SharingPermission[]>();

  useEffect(() => {
    loadPermissions();

    const permissionsListenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;

    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(permissionsListenerId, new SekundEventListener(["permissions.changed"], loadPermissions));
    return () => {
      eventsWatcher?.removeEventListener(permissionsListenerId);
    };
  }, []);

  async function loadPermissions() {
    if (!permissionsService) {
      permissionsService = PermissionsService.instance;
    }
    setPermissions(await permissionsService.getPermissions());
  }

  async function setStatus(sp: SharingPermission, status: PermissionRequestStatus) {
    if (!permissionsService) {
      permissionsService = PermissionsService.instance;
    }
    await permissionsService.setStatus(sp, status);
    setPermissions(await permissionsService.getPermissions());
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

  function Permissions(status: PermissionRequestStatus) {
    const filteredPermissions = permissions?.filter((p) => p.status === status);
    if (filteredPermissions && filteredPermissions.length > 0) {
      return (
        <>
          <div className="uppercase text-md text-obs-muted">{t(`permissionStatus.${status}`)}</div>
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

  return (
    <div className="relative flex flex-col w-full px-2">
      <div className="relative flex justify-center py-1 mt-1 space-x-1 text-lg text-obs-muted">
        <UsersIcon className="w-6 h-6" />
        <span>{t("yourContacts")}</span>
        <XIcon className="absolute w-6 h-6 cursor-pointer right-1 top-1" onClick={close} />
      </div>
      {permissions && permissions.length > 0 ? (
        <div className="flex flex-col mt-8">
          {Permissions("requested")}
          {Permissions("accepted")}
          {Permissions("rejected")}
          {Permissions("blocked")}
        </div>
      ) : (
        <div className="absolute inset-x-0 flex flex-col items-center justify-center p-8 inset-y-20">
          <div className="flex justify-center mb-2">
            <ExclamationCircleIcon className="w-6 h-6" />
          </div>
          <div className="text-center ">{t("noPermissions")}</div>
          <div className="mt-2 text-sm text-center ">{t("noPermissionsDesc")}</div>
        </div>
      )}
    </div>
  );
}
