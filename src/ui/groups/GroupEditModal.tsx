/* This example requires Tailwind CSS v2.0+ */
import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import { peopleAvatar } from "@/helpers/avatars";
import GroupsService from "@/services/GroupsService";
import PeoplesService from "@/services/PeoplesService";
import PermissionsService from "@/services/PermissionsService";
import { useAppContext } from "@/state/AppContext";
import { usePeoplesContext } from "@/state/PeoplesContext";
import { PeoplesActionKind } from "@/state/PeoplesReducer";
import AddUser from "@/ui/common/AddUser";
import { makeid } from "@/utils";
import { TrashIcon, XIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  group: Group | null;
  userId: ObjectID;
};

export default function GroupEditModal({ open, setOpen, group, userId }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const [commitEnabled, setCommitEnabled] = useState(false);
  const commitButton = useRef<HTMLButtonElement>(null);
  const { peoplesDispatch } = usePeoplesContext();
  const shade = useRef<any>();
  const [addUser, setAddUser] = useState(false);
  const { userProfile } = useAppContext().appState;

  if (group === null) {
    group = { peoples: [] as Array<People> } as Group;
  }
  const [localGroup, setLocalGroup] = useState<Group>({ ...group });
  const [teamMembers, setTeamMembers] = useState<SelectOption[]>([]);
  const selectInput = useRef<any>();

  useEffect(() => {
    loadOptions();
  }, [open]);

  useEffect(() => {
    const commitEnabled = localGroup?.name !== undefined && localGroup?.name.length > 0 && localGroup?.peoples.length > 0;
    setCommitEnabled(commitEnabled);
  }, [localGroup]);

  async function loadOptions() {
    let confirmedContacts = await PermissionsService.instance.getConfirmedContactOptions(userProfile);
    confirmedContacts = confirmedContacts.filter((option) => isNotAGroupMember(option.value.id));
    setTeamMembers(confirmedContacts);
  }

  function isNotAGroupMember(id: string): boolean {
    if (!group) {
      return false;
    }
    for (const p of group.peoples) {
      if (p._id.equals(new ObjectID(id))) {
        return false;
      }
    }
    return true;
  }

  async function addSelectedUser() {
    const selectElement = selectInput.current as HTMLSelectElement;
    const selectedUser = await PeoplesService.instance.getPeople(selectElement.value);
    setLocalGroup({ ...localGroup, peoples: [...localGroup.peoples, selectedUser] });
    selectElement.value = "none";
  }

  async function removePeople(p: People) {
    if (localGroup) {
      if (p._id.equals(userId)) {
        alert(t("youCannotRemoveYourself"));
        return;
      }
      const updtPeoples = localGroup.peoples?.filter((people) => people._id !== p._id);
      setLocalGroup({ ...localGroup, peoples: updtPeoples });
    }
  }

  function setGroupName(gn: string) {
    setLocalGroup({ ...localGroup, name: gn });
  }

  function setGroupIsPublic(checked: boolean) {
    setLocalGroup({ ...localGroup, isPublic: checked });
  }

  function setGroupDescription(desc: string) {
    setLocalGroup({ ...localGroup, description: desc });
  }

  async function commit() {
    try {
      const expandedGroup = await GroupsService.instance.upsertGroup(localGroup);
      if (expandedGroup) {
        setLocalGroup(expandedGroup);
        if (localGroup._id) {
          peoplesDispatch({ type: PeoplesActionKind.UpdateGroup, payload: expandedGroup });
        } else {
          peoplesDispatch({ type: PeoplesActionKind.AddGroup, payload: expandedGroup });
        }
        setOpen(false);
      }
    } catch (err) {
      const errorMessage = (err as any).toString();
      if (errorMessage.indexOf("A group by that name already exists") !== -1) {
        alert(t("aGroupByThatNameAlreadyExists"));
        return;
      }

      alert(t("unexpectedError"));
    }
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
          <XIcon onClick={() => removePeople(p)} className={`${closeButtonClasses} flex-shrink-0`}></XIcon>
        </div>
      )
    );
    return children;
  }

  function destroy() {
    const confirmed = confirm(t("areYouSure"));
    if (confirmed && group !== null && group._id) {
      GroupsService.instance.deleteGroup(group._id);
      peoplesDispatch({ type: PeoplesActionKind.RemoveGroup, payload: localGroup });
      setOpen(false);
    }
  }

  function deleteButton() {
    if (group?._id) {
      return (
        <button className="mr-0" onClick={destroy} type="button">
          <div className="flex items-center justify-center">
            <TrashIcon className="w-4 h-4"></TrashIcon>
          </div>
        </button>
      );
    }
    return <div></div>;
  }

  return (
    <div
      ref={shade}
      onClick={(evt) => {
        if (evt.target === shade.current) {
          setOpen(false);
        }
      }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-obs-cover"
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
        {addUser ? (
          <AddUser done={() => setAddUser(false)} />
        ) : (
          <>
            <div>
              <div className="text-lg font-medium leading-6 text-primary">{localGroup?._id ? t("plugin:editGroup") : t("plugin:addGroup")}</div>
              <div className="max-w-xl mt-2 text-sm text-secondary">
                <p>{t("plugin:groupName")}:</p>
              </div>
              <div className="flex-col mt-3">
                <input
                  onChange={(evt) => setGroupName(evt.target.value)}
                  defaultValue={group ? group.name : ""}
                  className="w-full input"
                  type="text"
                  placeholder={t("plugin:groupNameDesc")}
                />
                <textarea
                  className="w-full px-3 py-2 mt-2 text-md"
                  defaultValue={group.description || ""}
                  placeholder="Group description"
                  onChange={(evt) => setGroupDescription(evt.target.value)}
                />
                <div className="flex items-center justify-between pl-2 mt-1 space-x-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <span aria-label={t("plugin:publicGroupDesc")}>{t("plugin:public")}:</span>
                    <input
                      aria-label={t("plugin:publicGroupDesc")}
                      type="checkbox"
                      defaultChecked={group.isPublic}
                      onChange={(evt) => setGroupIsPublic(evt.target.checked)}
                    ></input>
                  </div>
                  {!group._id ? null : (
                    <div className="flex items-center space-x-1 overflow-hidden">
                      <span className="flex-shrink-0">ID:</span>
                      <span className="truncate select-text">{group._id.toString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="max-w-xl mt-4 text-sm text-secondary">
                <p>{t("plugin:groupMembers")}:</p>
              </div>
              <div className="flex flex-col mt-3 space-y-2">
                <div className="w-full overflow-hidden truncate">
                  <select className="w-full pl-2 pr-4 truncate dropdown" onChange={addSelectedUser} ref={selectInput}>
                    <>
                      <option key="none" value="none">
                        {t("plugin:chooseUser")}
                      </option>
                      {teamMembers.map((option: SelectOption) => (
                        <option key={option.value.id} value={option.value.id}>
                          {option.label}
                        </option>
                      ))}
                    </>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap mt-5 overflow-auto sm:mt-6 text-secondary" style={{ maxHeight: "200px" }}>
              {members()}
            </div>
            <div className="flex items-center justify-between mt-4">
              {deleteButton()}
              <div className="flex justify-end space-x-2">
                <button className="mr-0" onClick={() => setOpen(false)} type="button">
                  {t("cancel")}
                </button>
                <button className="mr-0 overflow-hidden" ref={commitButton} onClick={commitEnabled ? commit : undefined} type="button">
                  <span className="truncate">{localGroup?._id ? t("update") : t("create")}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
