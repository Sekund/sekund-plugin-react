import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import GroupsService from "@/services/GroupsService";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import PermissionsService from "@/services/PermissionsService";
import { useAppContext } from "@/state/AppContext";
import { XIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  note: Note;
  userId: ObjectID;
  className: string;
};

export default function NoteSharing({ note, userId, className }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const { sharing } = note;
  const [state, setState] = useState(0);
  const forceUpdate = () => setState(state + 1);
  const [sharingGroupsOptions, setSharingGroupsOptions] = useState<SelectOption[]>([]);
  const [sharingPeoplesOptions, setSharingPeoplesOptions] = useState<SelectOption[]>([]);
  const selectInput = useRef<any>();
  const { userProfile } = useAppContext().appState;

  useEffect(() => {
    loadOptions();
  }, [open]);

  async function loadOptions() {
    const alreadySharing = sharing.peoples?.map((p) => p._id) || [];
    alreadySharing.push(userId);
    const confirmedContacts = await PermissionsService.instance.getConfirmedContactOptions(userProfile);
    const confirmedGroups = await GroupsService.instance.getConfirmedGroupOptions(userProfile);
    setSharingGroupsOptions(confirmedGroups);
    setSharingPeoplesOptions(confirmedContacts);
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

  async function addSelectedUserOrGroup() {
    const selectElement = selectInput.current as HTMLSelectElement;
    const [type, id] = selectElement.value.split("-");
    if (type === "user") {
      const people = await PeoplesService.instance.getPeople(id);
      await NotesService.instance.addSharingPeople(note._id, people);
      note.sharing?.peoples?.push(people);
    } else {
      const group = await GroupsService.instance.fetchGroup(id);
      await NotesService.instance.addSharingGroup(note._id, group);
      note.sharing?.groups?.push(group);
    }
    selectElement.value = "none";
    forceUpdate();
  }

  function shares() {
    if (sharing === undefined) return null;
    const children: JSX.Element[] = [];
    const closeButtonClasses = "rounded-md cursor-pointer hover:text-secondary focus:outline-none w-4 h-4 m-2";
    if (sharing?.groups?.length !== 0) {
      const { groups } = sharing;
      groups?.forEach((g, idx) => {
        if (g) {
          children.push(
            <div key={g._id ? g._id.toString() : idx} className="flex items-center py-1 pl-2 pr-1 mb-1 mr-1 truncate rounded-md bg-obs-tertiary">
              {groupAvatar(g, 6)}
              <span className="ml-2 truncate">{g.name}</span>
              <XIcon onClick={() => removeGroup(g)} className={closeButtonClasses}></XIcon>
            </div>
          );
        } else {
          console.log("empty group here", note);
        }
      });
    }
    if (sharing?.peoples?.length !== 0) {
      if (sharing === undefined) return null;
      const { peoples } = sharing;
      peoples?.forEach((p) =>
        children.push(
          <div key={p._id.toString()} className="flex items-center py-1 pl-2 pr-1 mb-1 mr-1 truncate rounded-md bg-obs-tertiary">
            {peopleAvatar(p, 6)}
            <span className="ml-2 truncate whitespace-nowrap">{`${p.name || p.email}`}</span>
            <XIcon onClick={() => removePeople(p)} className={closeButtonClasses}></XIcon>
          </div>
        )
      );
    }
    return (
      <div className="flex flex-wrap overflow-auto" style={{ maxHeight: "calc(100vh - 400px)" }}>
        {children}
      </div>
    );
  }

  function SharingOptions() {
    return (
      <div className="flex flex-col space-y-2">
        <div className="max-w-xl text-sm text-secondary">
          <p>{t("plugin:shareWithWhom")}</p>
        </div>
        <div className="flex flex-col">
          <div className="w-full overflow-hidden truncate">
            <select ref={selectInput} className="min-w-full pl-2 pr-4 truncate dropdown" onChange={addSelectedUserOrGroup}>
              <option key="none" value="none">
                {t("selectUserOrGroup")}
              </option>
              {sharingGroupsOptions.length > 0 ? (
                <optgroup label={t("groups")}>
                  {sharingGroupsOptions.map((option: SelectOption) => (
                    <option key={option.value.id} value={`${option.value.type}-${option.value.id}`}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ) : null}
              {sharingPeoplesOptions.length > 0 ? (
                <optgroup label={t("peoples")}>
                  {sharingPeoplesOptions.map((option: SelectOption) => (
                    <option key={option.value.id} value={`${option.value.type}-${option.value.id}`}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ) : null}
            </select>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 text-secondary">{shares()}</div>
      </div>
    );
  }

  return (
    <div className={`${className} relative inline-block w-full max-w-xs p-6 px-4 pt-5 pb-4 text-left rounded-lg sm:my-8 bg-obs-primary`}>
      <SharingOptions />
    </div>
  );
}
