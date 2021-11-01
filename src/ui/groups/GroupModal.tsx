/* This example requires Tailwind CSS v2.0+ */
import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import { peopleAvatar } from "@/helpers/avatars";
import { setHandleDisplay } from "@/helpers/obsidian";
import GroupsService from "@/services/GroupsService";
import UsersService from "@/services/UsersService";
import { useAppContext } from "@/state/AppContext";
import { usePeoplesContext } from "@/state/PeoplesContext";
import { PeoplesActionKind } from "@/state/PeoplesReducer";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon, XIcon } from "@heroicons/react/solid";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
// import AsyncSelect from "react-select/async";
import reactSelectObsidianTheme from '@/helpers/reactSelect'

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  group: Group | null;
};

export default function GroupModal({ open, setOpen, group }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const [selectedUser, setSelectedUser] = useState<People | null>(null);
  const [commitEnabled, setCommitEnabled] = useState(false);
  const commitButton = useRef<HTMLButtonElement>(null);
  const { peoplesDispatch } = usePeoplesContext();

  const { appState } = useAppContext();
  const { userProfile } = appState;

  if (group === null) {
    group = { peoples: [] as Array<People> } as Group;
  }
  const [localGroup, setLocalGroup] = useState<Group>(group);
  const selectInput = useRef<any>();

  // remove those pesky resize handles when showing this modal, and restore
  // them when it closes
  useEffect(() => {
    setHandleDisplay('none');
    return () => {
      setHandleDisplay('');
    }
  }, [open])

  useEffect(() => {
    const commitEnabled = localGroup?.name !== undefined && localGroup?.name.length > 0 && localGroup?.peoples.length > 0;
    setCommitEnabled(commitEnabled);
  }, [localGroup]);

  async function loadOptions(inputValue: string): Promise<SelectOption[]> {
    const found = (await UsersService.instance.findUsers(inputValue.toLowerCase(), [userProfile._id])).filter((userOrGroup) => userOrGroup.value.type === "user");
    return found;
  }

  async function addSelectedUser() {
    if (selectedUser !== null) {
      // selectInput.current.clearValue();
      setLocalGroup({ ...localGroup, peoples: [...localGroup.peoples, selectedUser] });
    }
  }

  async function removePeople(p: People) {
    if (localGroup) {
      if (p._id.equals(userProfile._id)) {
        alert("You cannot remove yourself.");
        return;
      }
      const updtPeoples = localGroup.peoples?.filter((people) => people._id !== p._id);
      setLocalGroup({ ...localGroup, peoples: updtPeoples });
    }
  }

  function setGroupName(gn: string) {
    setLocalGroup({ ...localGroup, name: gn });
  }

  async function commit() {
    const expandedGroup = await GroupsService.instance.upsertGroup(localGroup);
    setLocalGroup(expandedGroup);
    if (localGroup._id) {
      peoplesDispatch({ type: PeoplesActionKind.UpdateGroup, payload: expandedGroup });
    } else {
      peoplesDispatch({ type: PeoplesActionKind.AddGroup, payload: expandedGroup });
    }
    setOpen(false);
  }

  function members() {
    const children: JSX.Element[] = [];
    const closeButtonClasses = "rounded-md cursor-pointer hover:text-secondary focus:outline-none w-4 h-4 m-2";
    const { peoples } = localGroup;
    peoples.forEach((p) =>
      children.push(
        <div key={p._id.toString()} className="flex items-center py-1 pl-2 pr-1 mb-1 mr-1 rounded-md bg-obs-tertiary">
          {peopleAvatar(p)}
          <span className="ml-2">{`${p.name || p.email}`}</span>
          <XIcon onClick={() => removePeople(p)} className={closeButtonClasses}></XIcon>
        </div>
      )
    );
    return children;
  }

  function destroy() {
    const confirmed = confirm("Are you sure?");
    if (confirmed && group !== null && group._id) {
      GroupsService.instance.deleteGroup(group._id);
      peoplesDispatch({ type: PeoplesActionKind.RemoveGroup, payload: localGroup });
      setOpen(false);
    }
  }

  function deleteButton() {
    if (group?._id) {
      return (
        <button onClick={destroy} type="button" className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm cursor-pointer bg-accent text-white border-transparent`}>
          <div className="flex items-center">
            Delete
            <TrashIcon className="w-4 h-4 ml-2"></TrashIcon>
          </div>
        </button>
      );
    }
    return <div></div>;
  }

  const buttonClasses = "inline-flex items-center justify-center h-full px-4 py-2 mt-3 font-medium border rounded-md shadow-sm bg-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm";

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="inline-block px-4 pt-5 pb-4 text-left align-bottom transition-all transform rounded-lg sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 bg-obs-primary">
              <div className="fixed top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button type="button" className="flex flex-col justify-center text-gray-400 rounded-md bg-primary hover:text-secondary focus:outline-none" onClick={() => setOpen(false)}>
                  <span className="sr-only">{t('close')}</span>
                  <XIcon className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                <div className="text-lg font-medium leading-6 text-primary">{localGroup?._id ? t('plugin:editGroup') : t('plugin:addGroup')}</div>
                <div className="max-w-xl mt-2 text-sm text-secondary">
                  <p>{t('plugin:groupName')}:</p>
                </div>
                <div className="mt-3 sm:flex sm:items-center">
                  <input onChange={(evt) => setGroupName(evt.target.value)} defaultValue={group ? group.name : ""} className="w-full text-gray-800 input" type="text" placeholder={t('plugin:groupNameDesc')} />
                </div>
                <div className="max-w-xl mt-4 text-sm text-secondary">
                  <p>{t('plugin:groupMembers')}:</p>
                </div>
                <div className="mt-3 sm:flex sm:items-center">
                  <div className="w-full sm:max-w-xs">
                    <select
                      ref={selectInput}
                      className="w-full"
                      onChange={(v: any) => {
                        if (v) {
                          setSelectedUser(v.value);
                        }
                      }}
                    >
                    </select>
                  </div>
                  <button className={`inline-flex items-center px-4 ml-3 py-2 border h-full text-sm font-medium rounded-md shadow-sm cursor-pointer ${selectedUser ? "bg-accent hover:bg-accent border" : "bg-transparent text-disabled border"} focus:outline-none`} onClick={() => addSelectedUser()}>
                    {t('add')}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap mt-5 sm:mt-6 text-secondary">{members()}</div>
              <div className="flex items-center justify-between mt-4">
                {deleteButton()}
                <div className="flex justify-end w-full pt-2">
                  <button onClick={() => setOpen(false)} type="button" className={buttonClasses}>
                    {t('cancel')}
                  </button>
                  <button ref={commitButton} onClick={commitEnabled ? commit : undefined} type="button" className={`relative h-full inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm cursor-pointer ${commitEnabled ? "bg-accent hover:bg-accent border" : "bg-transparent text-disabled border"} focus:outline-none`}>
                    {localGroup?._id ? t('update') : t('create')}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
