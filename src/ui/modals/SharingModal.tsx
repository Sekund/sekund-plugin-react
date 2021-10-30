import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import { setHandleDisplay } from "@/helpers/obsidian";
import NotesService from "@/services/NotesService";
import UsersService from "@/services/UsersService";
import { useAppContext } from "@/state/AppContext";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncSelect from "react-select/async";
import reactSelectObsidianTheme from '@/helpers/reactSelect'

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  note: Note;
};

export default function SharingModal({ open, setOpen, note }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const { sharing } = note;
  const [state, setState] = useState(0);
  const { appState } = useAppContext();
  const { userProfile } = appState;
  const [selectedUserOrGroup, setSelectedUserOrGroup] = useState<People | Group | null>(null);
  const forceUpdate = () => setState(state + 1);
  const selectInput = useRef<any>();

  // remove those pesky resize handles when showing this modal, and restore
  // them when it closes
  useEffect(() => {
    setHandleDisplay('none');
    return () => {
      setHandleDisplay('');
    }
  }, [open])

  async function loadOptions(inputValue: string): Promise<SelectOption[]> {
    const alreadySharing = sharing.peoples?.map((p) => p._id) || [];
    if (userProfile) { alreadySharing.push(userProfile._id) }
    const found = await UsersService.instance
      .findUsers(inputValue.toLowerCase(), alreadySharing);
    return found;
  }

  async function removeGroup(g: Group) {
    await NotesService.instance.removeSharingGroup(note._id, g);
    note.sharing.groups = note.sharing?.groups?.filter((group) => group._id !== g._id);
    forceUpdate();
  }

  async function removePeople(p: People) {
    await NotesService.instance.removeSharingPeople(note._id, p);
    note.sharing.peoples = note.sharing?.peoples?.filter((people) => people._id !== p._id);
    forceUpdate();
  }

  function selectUserOrGroup(v: People | Group) {
    setSelectedUserOrGroup(v);
  }

  async function addSelectedUserOrGroup() {
    if (selectedUserOrGroup !== null) {
      if ((selectedUserOrGroup as any).type === "user") {
        await NotesService.instance.addSharingPeople(note._id, selectedUserOrGroup as People);
        note.sharing?.peoples?.push(selectedUserOrGroup as People);
      } else {
        await NotesService.instance.addSharingGroup(note._id, selectedUserOrGroup as Group);
        note.sharing?.groups?.push(selectedUserOrGroup as Group);
      }
      if (selectInput.current) {
        selectInput.current.clearValue();
      }
      forceUpdate();
    }
  }

  function shares() {
    if (sharing === undefined) return null;
    const children: JSX.Element[] = [];
    const closeButtonClasses = "rounded-md cursor-pointer hover:text-secondary focus:outline-none w-4 h-4 m-2";
    if (sharing?.groups?.length !== 0) {
      const { groups } = sharing;
      groups?.forEach((g, idx) =>
        children.push(
          <div key={g._id ? g._id.toString() : idx} className="flex items-center py-1 pl-2 pr-1 mb-1 mr-1 rounded-md bg-obs-tertiary">
            {groupAvatar(g)}
            <span className="ml-1">{g.name}</span>
            <XIcon onClick={() => removeGroup(g)} className={closeButtonClasses}></XIcon>
          </div>
        )
      );
    }
    if (sharing?.peoples?.length !== 0) {
      if (sharing === undefined) return null;
      const { peoples } = sharing;
      peoples?.forEach((p) =>
        children.push(
          <div key={p._id.toString()} className="flex items-center py-1 pl-2 pr-1 mb-1 mr-1 rounded-md bg-obs-tertiary">
            {peopleAvatar(p)}
            <span className="ml-2 whitespace-nowrap">{`${p.name || p.email}`}</span>
            <XIcon onClick={() => removePeople(p)} className={closeButtonClasses}></XIcon>
          </div>
        )
      );
    }
    return <div className="flex flex-wrap">{children}</div>;
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
                <div className="text-lg font-medium leading-6 text-primary">{t("plugin:setSharingOptions")}</div>
                <div className="max-w-xl mt-2 text-sm text-secondary">
                  <p>{t('plugin:shareWithWhom')}</p>
                </div>
                <div className="mt-5 sm:flex sm:items-center">
                  <div className="w-full sm:max-w-xs">
                    <AsyncSelect
                      ref={selectInput}
                      placeholder="Choose a user or a group"
                      styles={reactSelectObsidianTheme}
                      className="w-full text-sm bg-primary text-obs-normal"
                      loadOptions={loadOptions}
                      onChange={(v: any) => {
                        if (v) {
                          selectUserOrGroup(v.value);
                        }
                      }}
                    />
                  </div>
                  <button className="inline-flex items-center justify-center w-full h-full px-4 py-2 mt-3 font-medium border rounded-md shadow-sm bg-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => addSelectedUserOrGroup()}>
                    {t('add')}
                  </button>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 text-secondary">{shares()}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
