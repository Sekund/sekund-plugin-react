import { PermissionRequestStatus, SharingPermission } from "@/domain/SharingPermission";
import { peopleAvatar } from "@/helpers/avatars";
import PermissionsService from "@/services/PermissionsService";
import InactiveContactSummary from "@/ui/v2/contacts/InactiveContactSummary";
import { BanIcon, CheckCircleIcon, UsersIcon, XCircleIcon } from "@heroicons/react/solid";
import React from "react";
import { useTranslation } from "react-i18next";

function ContactRequestTitle() {
  return (
    <>
      <UsersIcon className="w-4 h-4" />
      <span>Contact request, my friend</span>
    </>
  );
}

function ContactRequestContent({ sharingPermission }: { sharingPermission: SharingPermission }) {
  const { t } = useTranslation();
  const { user, group, status, userInfo } = sharingPermission;

  function ItemAvatar() {
    if (user) {
      return peopleAvatar(user, 10);
    }
    return null;
  }

  function ItemName() {
    if (user) {
      return user.name ? user.name : user.email;
    }
    return null;
  }

  function Message() {
    return (
      <span className="flex flex-col">
        <div className="truncate">{ItemName()}</div>
        <div>{t("wouldLikeToAddYouToTheirContacts")}</div>
      </span>
    );
  }

  function handleClick(sharingPermission: SharingPermission, status: PermissionRequestStatus) {
    PermissionsService.instance.setStatus(sharingPermission, status);
  }

  function Actions() {
    return (
      <div className="flex space-x-1">
        <a
          aria-label={t("Block")}
          className="text-red-500 rounded-full opacity-50 hover:opacity-100"
          onClick={() => handleClick(sharingPermission, "blocked")}
        >
          <BanIcon className="w-6 h-6" />
        </a>
        <a
          aria-label={t("Reject")}
          className="text-red-500 rounded-full opacity-50 hover:opacity-100"
          onClick={() => handleClick(sharingPermission, "rejected")}
        >
          <XCircleIcon className="w-6 h-6" />
        </a>
        <a
          aria-label={t("Accept")}
          className="text-green-500 rounded-full opacity-50 hover:opacity-100"
          onClick={() => handleClick(sharingPermission, "accepted")}
        >
          <CheckCircleIcon className="w-6 h-6" />
        </a>
      </div>
    );
  }

  return (
    <div className={`flex items-center pl-3 pr-1 py-2 space-x-2 text-sm bg-accent-1 text-accent-4`}>
      <div className="flex-shrink-0">
        <ItemAvatar />
      </div>
      <div className="flex items-center justify-between w-full space-x-2 overflow-hidden">
        <div className="flex flex-col overflow-hidden grow">
          <Message />
        </div>
        <div className="flex-shrink-0">
          <div className="flex items-center">
            <Actions />
          </div>
        </div>
      </div>
    </div>
  );
}

export { ContactRequestTitle, ContactRequestContent };
