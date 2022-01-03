import { PermissionRequestStatus, SharingPermission } from "@/domain/SharingPermission";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import React from "react";

type Props = {
  sharingPermission: SharingPermission;
  setStatus: (sp: SharingPermission, status: PermissionRequestStatus) => void;
};

export default function PermissionSummaryComponent({ sharingPermission, setStatus }: Props) {
  const { user, group, status } = sharingPermission;

  function ItemAvatar() {
    if (user) {
      return peopleAvatar(user, 6);
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

  function Action() {
    switch (status) {
      case "requested":
        return (
          <>
            <option>Action...</option>
            <option value="accepted">Accept</option>
            <option value="rejected">Reject</option>
            <option value="blocked">Block</option>
          </>
        );
      case "accepted":
        return (
          <>
            <option>Action...</option>
            <option value="rejected">Reject</option>
            <option value="blocked">Block</option>
          </>
        );
      case "rejected":
        return (
          <>
            <option>Action...</option>
            <option value="accepted">Accept</option>
            <option value="blocked">Block</option>
          </>
        );
      case "blocked":
        return (
          <>
            <option>Action...</option>
            <option value="accepted">Accept</option>
          </>
        );
    }
  }

  return (
    <div className="flex items-center px-3 py-2 space-x-2 text-sm">
      <div className="flex-shrink-0">
        <ItemAvatar />
      </div>
      <div className="flex items-center justify-between w-full space-x-2 overflow-hidden">
        <div className="flex flex-col flex-grow overflow-hidden">
          <span className="truncate">{ItemName()}</span>
        </div>
        <select className="flex-shrink-0 dropdown" onChange={(evt) => setStatus(sharingPermission, evt.target.value as PermissionRequestStatus)}>
          <Action />
        </select>
      </div>
    </div>
  );
}
