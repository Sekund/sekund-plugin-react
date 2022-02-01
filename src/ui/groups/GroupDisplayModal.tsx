/* This example requires Tailwind CSS v2.0+ */
import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import { peopleAvatar } from "@/helpers/avatars";
import GroupsService from "@/services/GroupsService";
import PermissionsService from "@/services/PermissionsService";
import { useAppContext } from "@/state/AppContext";
import { makeid } from "@/utils";
import { LogoutIcon, XIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  group: Group;
};

export default function GroupDisplayModal({ open, setOpen, group }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const shade = useRef<any>();
  const { userProfile } = useAppContext().appState;

  if (group === null) {
    group = { peoples: [] as Array<People> } as Group;
  }
  const [localGroup] = useState<Group>({ ...group });
  const [teamMembers, setTeamMembers] = useState<SelectOption[]>([]);

  useEffect(() => {
    loadOptions();
  }, [open]);

  async function loadOptions() {
    const confirmedContacts = await PermissionsService.instance.getConfirmedContactOptions(userProfile);
    setTeamMembers(confirmedContacts);
  }

  function members() {
    const children: JSX.Element[] = [];
    const closeButtonClasses = "rounded-md cursor-pointer hover:text-secondary focus:outline-none w-4 h-4 m-2";
    const { peoples } = localGroup;
    peoples.forEach((p) =>
      children.push(
        <div
          key={p._id ? p._id.toString() : p.name || makeid(5)}
          className="flex items-center py-1 pl-2 pr-1 mb-1 mr-1 truncate rounded-md bg-obs-tertiary"
        >
          {peopleAvatar(p, 6)}
          <span className="ml-2 truncate">{`${p.name || p.email}`}</span>
        </div>
      )
    );
    return children;
  }

  async function leaveGroup() {
    if (confirm(t("confirmLeaveGroup"))) {
      await GroupsService.instance.leaveGroup(group._id);
      setOpen(false);
    }
  }

  return (
    <div
      ref={shade}
      onClick={(evt) => {
        if (evt.target === shade.current) {
          setOpen(false);
        }
      }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-obs-cover"
    >
      <div className="relative inline-block w-full max-w-xs p-6 px-4 pt-5 pb-4 text-left rounded-lg sm:my-8 bg-obs-primary">
        <div className="absolute top-0 right-0 pt-4 pr-4 sm:block">
          <div
            className="flex flex-col justify-center rounded-md cursor-pointer bg-primary hover:text-obs-muted focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">{t("close")}</span>
            <XIcon className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
        <>
          <div>
            <div className="text-lg font-medium leading-6 text-primary">{localGroup.name}</div>
          </div>
          <div className="max-w-xl mt-4 text-sm text-secondary">
            <p>{t("plugin:groupMembers")}:</p>
          </div>
          <div className="flex flex-wrap mt-5 overflow-auto sm:mt-6 text-secondary" style={{ maxHeight: "250px" }}>
            {members()}
          </div>
          <div className="flex items-center justify-center mt-4">
            <button className="flex items-center mr-0" onClick={leaveGroup} type="button">
              {t("leaveThisGroup")}
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-end mt-4">
            <button className="mr-0" onClick={() => setOpen(false)} type="button">
              {t("cancel")}
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
