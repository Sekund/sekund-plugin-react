import { PermissionRequestStatus, SharingPermission } from "@/domain/SharingPermission";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import { useAppContext } from "@/state/AppContext";
import { capitalize } from "@/utils";
import { BanIcon, CheckCircleIcon, QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  sharingPermission: SharingPermission;
  setStatus: (sp: SharingPermission, status: PermissionRequestStatus) => void;
};

export default function PermissionSummaryComponent({ sharingPermission, setStatus }: Props) {
  const { t } = useTranslation();
  const { appState } = useAppContext();
  const { user, group, status, userInfo } = sharingPermission;
  const { userProfile } = appState;

  function ItemAvatar() {
    if (user) {
      return peopleAvatar(userInfo._id.equals(userProfile._id) ? user : userInfo, 6);
    }
    if (group) {
      return groupAvatar(group, 6);
    }
    return null;
  }

  function ItemName() {
    if (user) {
      return user.name ? user.name : user.email;
    }
    if (group) {
      return group.name;
    }
    return null;
  }

  function isIncomingRequest() {
    return sharingPermission.status === "requested" && sharingPermission.userId.equals(userProfile._id);
  }

  function Message() {
    if (isIncomingRequest()) {
      return (
        <span className="flex flex-col">
          <div className="truncate">{ItemName()}</div>
          <div>{t("wouldLikeToAddYouToTheirContacts")}</div>
        </span>
      );
    }
    if (sharingPermission.status === "requested") {
      return (
        <div className="flex items-center space-x-1 truncate">
          <span>{ItemName()}</span>
          <QuestionMarkCircleIcon className="w-4 h-4" />
        </div>
      );
    }
    return <span className="truncate">{ItemName()}</span>;
  }

  function Actions() {
    switch (status) {
      case "requested":
        if (isIncomingRequest())
          return (
            <div className="flex space-x-1">
              <a
                aria-label={t("Block")}
                className="text-red-500 rounded-full opacity-50 hover:opacity-100"
                onClick={() => setStatus(sharingPermission, "blocked")}
              >
                <BanIcon className="w-6 h-6" />
              </a>
              <a
                aria-label={t("Reject")}
                className="text-red-500 rounded-full opacity-50 hover:opacity-100"
                onClick={() => setStatus(sharingPermission, "rejected")}
              >
                <XCircleIcon className="w-6 h-6" />
              </a>
              <a
                aria-label={t("Accept")}
                className="text-green-500 rounded-full opacity-50 hover:opacity-100"
                onClick={() => setStatus(sharingPermission, "accepted")}
              >
                <CheckCircleIcon className="w-6 h-6" />
              </a>
            </div>
          );
        else {
          return (
            <div className="flex space-x-1">
              <a
                aria-label={capitalize(t("cancel"))}
                className="text-red-500 rounded-full opacity-50 hover:opacity-100"
                onClick={() => setStatus(sharingPermission, "rejected")}
              >
                <XCircleIcon className="w-6 h-6" />
              </a>
            </div>
          );
        }
      case "accepted":
        return (
          <div className="flex space-x-1">
            <a
              aria-label={t("Block")}
              className="text-red-500 rounded-full opacity-50 hover:opacity-100"
              onClick={() => setStatus(sharingPermission, "blocked")}
            >
              <BanIcon className="w-6 h-6" />
            </a>
            <a
              aria-label={t("Reject")}
              className="text-red-500 rounded-full opacity-50 hover:opacity-100"
              onClick={() => setStatus(sharingPermission, "rejected")}
            >
              <XCircleIcon className="w-6 h-6" />
            </a>
          </div>
        );
      case "blocked":
        return (
          <div className="flex space-x-1">
            <a
              aria-label={t("Accept")}
              className="text-green-500 rounded-full opacity-50 hover:opacity-100"
              onClick={() => setStatus(sharingPermission, "accepted")}
            >
              <CheckCircleIcon className="w-6 h-6" />
            </a>
          </div>
        );
    }
    return null;
  }

  return (
    <div
      className={`flex items-center px-3 py-2 space-x-2 text-sm ${
        isIncomingRequest() ? "bg-accent-1 border text-accent-4 border-accent-4 border-solid rounded-md" : ""
      }`}
    >
      <div className="flex-shrink-0">
        <ItemAvatar />
      </div>
      <div className="flex items-center justify-between w-full space-x-2 overflow-hidden">
        <div className="flex flex-col flex-grow overflow-hidden">
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
