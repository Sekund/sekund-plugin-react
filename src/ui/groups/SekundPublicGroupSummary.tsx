import { Group } from "@/domain/Group";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import GroupsService from "@/services/GroupsService";
import { useAppContext } from "@/state/AppContext";
import { EyeIcon, LogoutIcon, PlusIcon } from "@heroicons/react/solid";
import { AvatarGroup } from "@mui/material";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
type Props = {
  group: Group;
  displayGroup: (group: Group) => void;
};

export default function SekundPublicGroupSummary({ group, displayGroup }: Props) {
  const { t } = useTranslation();
  const expandedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [localGroup, setLocalGroup] = useState<Group>(group);
  const { appState } = useAppContext();
  const { userProfile } = appState;

  async function toggleExpanded() {
    expandedRef.current = !expandedRef.current;
    setExpanded(expandedRef.current);
  }

  function isGroupOwner() {
    return localGroup.userId.equals(userProfile._id);
  }

  function isGroupMember() {
    for (const member of localGroup.peoples) {
      if (member._id.equals(userProfile._id)) return true;
    }
    return false;
  }

  function GroupMembers(): JSX.Element {
    return (
      <div className="flex items-center p-1 ml-1 space-x-1 overflow-hidden cursor-pointer" onClick={() => displayGroup(localGroup)}>
        <AvatarGroup className="h-6" sx={{ height: 24 }}>
          {group.peoples.map((people) => peopleAvatar(people, 6))}
        </AvatarGroup>
        <EyeIcon className="w-4 h-4" />
      </div>
    );
  }

  async function leave() {
    if (confirm(t("confirmLeaveGroup"))) {
      const updtPeoples = group.peoples.filter((p) => !p._id.equals(userProfile._id));
      const updtGroup = { ...group, peoples: updtPeoples };
      await GroupsService.instance.upsertGroup(updtGroup);
      setLocalGroup(updtGroup);
    }
  }

  async function join() {
    const updtGroup = { ...group, peoples: [...group.peoples, userProfile] };
    await GroupsService.instance.upsertGroup(updtGroup);
    setLocalGroup(updtGroup);
  }

  function LeaveButton() {
    return (
      <button className="flex items-center space-x-1" onClick={leave}>
        <span>{t("leave")}</span>
        <LogoutIcon className="w-4 h-4" />
      </button>
    );
  }

  function JoinButton() {
    return (
      <button className="flex items-center space-x-1" onClick={join}>
        <span>{t("joinThisGroup")}</span>
        <PlusIcon className="w-4 h-4" />
      </button>
    );
  }

  function Button() {
    if (isGroupOwner()) {
      return null;
    }
    return isGroupMember() ? <LeaveButton /> : <JoinButton />;
  }

  return (
    <div className="flex flex-col" style={{ borderRight: "none", borderLeft: "none" }}>
      <div
        key={group._id.toString()}
        className="flex items-center justify-between w-full mx-auto cursor-pointer bg-obs-primary-alt hover:bg-obs-primary"
      >
        <div className="flex items-center px-3 py-2 space-x-2 text-sm cursor-pointer" onClick={toggleExpanded}>
          <div className="flex">{groupAvatar(localGroup, 10, 0)}</div>
          <div className="truncate text-md text-primary hover:underline">{localGroup.name}</div>
        </div>
        <Button />
      </div>
      {expanded ? (
        <div className="flex flex-col px-4 space-y-2">
          <GroupMembers />
          <span className="text-sm">{localGroup.description || t("noGroupDescription")}</span>
        </div>
      ) : null}
    </div>
  );
}
