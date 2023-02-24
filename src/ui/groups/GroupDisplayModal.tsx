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
  closeDialog: () => void;
  group: Group;
};

export default function ContactEditModal({ open, closeDialog, group }: Props) {
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

  function Members() {
    const { peoples } = localGroup;
    return (
      <div className="flex flex-wrap mt-5 overflow-auto sm:mt-6 text-secondary" style={{ maxHeight: "250px" }}>
        {peoples.map((p) => (
          <div
            key={p._id ? p._id.toString() : p.name || makeid(5)}
            className="flex items-center py-1 pl-2 pr-1 mb-1 mr-1 truncate rounded-md bg-obs-tertiary"
          >
            {peopleAvatar(p, 6)}
            <span className="ml-2 truncate">{`${p.name || p.email}`}</span>
          </div>
        ))}
      </div>
    );
  }

  async function leaveGroup() {
    if (confirm(t("confirmLeaveGroup"))) {
      await GroupsService.instance.leaveGroup(group._id);
      closeDialog();
    }
  }

  return (
    <div
      ref={shade}
      onClick={(evt) => {
        if (evt.target === shade.current) {
          closeDialog();
        }
      }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-obs-cover"
    >
      <div className="relative inline-block w-full h-full p-6 px-4 pt-5 pb-4 text-left sm:my-8 bg-obs-primary">
        <div className="absolute top-0 right-0 z-50 pt-4 pr-4 sm:block">
          <div
            className="flex flex-col justify-center rounded-md cursor-pointer bg-primary hover:text-obs-muted focus:outline-none"
            onClick={() => closeDialog()}
          >
            <span className="sr-only">{t("close")}</span>
            <XIcon className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
        <>
          <div>
            <div className="text-lg font-medium leading-6 text-primary">{localGroup.name}</div>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="max-w-xs">
              <div className="mt-4 text-sm text-secondary">
                <p>{t("plugin:groupMembers")}:</p>
              </div>
              <Members />
              <div className="flex items-center justify-center mt-4">
                {localGroup.userId.equals(userProfile._id) ? null : (
                  <button className="flex items-center justify-center mr-0" onClick={leaveGroup} type="button">
                    {t("leaveThisGroup")}
                    <LogoutIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-end mt-6">
                <button className="mr-0" onClick={() => closeDialog()} type="button">
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
