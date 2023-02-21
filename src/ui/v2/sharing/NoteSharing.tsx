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
import NoActiveFile from "@/ui/v2/NoActiveFile";
import { XIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { ReactChild, ReactChildren, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  userId: ObjectID;
  active: boolean;
  syncUp: () => void;
  syncDown: (id: ObjectID, userId: string) => void;
  unpublish: () => void;
};

export default function NoteSharing({ userId, syncUp, unpublish, active }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const { appState } = useAppContext();
  const { remoteNote: note, currentFile, generalState } = appState;
  const { fileSynced, publishing, fetching, updating } = appState.currentNoteState;
  const [sharingGroupsOptions, setSharingGroupsOptions] = useState<SelectOption[]>([]);
  const [sharingPeoplesOptions, setSharingPeoplesOptions] = useState<SelectOption[]>([]);

  const [sharing, setSharing] = useState<Note["sharing"]>({ groups: [], peoples: [] });

  const selectInput = useRef<any>();
  const { userProfile } = useAppContext().appState;

  useEffect(() => {
    if (active && generalState === "allGood") {
      console.log("activating the note sharing component");
      loadOptions();
    }
  }, [active]);

  useEffect(() => {
    if (note) {
      setSharing(note.sharing);
    } else {
      setSharing({ groups: [], peoples: [] });
    }
  }, [note]);

  async function loadOptions() {
    const confirmedContacts = await PermissionsService.instance.getConfirmedContactOptions(userProfile);
    const confirmedGroups = await GroupsService.instance.getConfirmedGroupOptions(userProfile);
    setSharingGroupsOptions(confirmedGroups.sort((a, b) => a.label.localeCompare(b.label)));
    setSharingPeoplesOptions(confirmedContacts.sort((a, b) => a.label.localeCompare(b.label)));
  }

  async function removeGroup(g: Group) {
    if (!note) return;
    await NotesService.instance.removeSharingGroup(note._id, g);
    note.sharing.groups = note.sharing?.groups?.filter((group) => group._id !== g._id);
    setSharing({ ...note.sharing });
  }

  async function removePeople(p: People) {
    if (!note) return;
    await NotesService.instance.removeSharingPeople(note._id, p);
    note.sharing.peoples = note.sharing?.peoples?.filter((people) => people._id !== p._id);
    setSharing({ ...note.sharing });
  }

  async function addSelectedUserOrGroup() {
    if (!note) return;
    const selectElement = selectInput.current as HTMLSelectElement;
    const [type, id] = selectElement.value.split("-");
    if (type === "user") {
      const people = await PeoplesService.instance.getPeople(id);
      if (!people) return;
      if (note.sharing?.peoples?.find((p) => p._id.equals(people._id))) return;
      await NotesService.instance.addSharingPeople(note._id, people);
      note.sharing?.peoples?.push(people);
    } else {
      const group = await GroupsService.instance.fetchGroup(id);
      if (!group) return;
      if (note.sharing?.groups?.find((g) => g._id.equals(group._id))) return;
      await NotesService.instance.addSharingGroup(note._id, group);
      note.sharing?.groups?.push(group);
    }
    setSharing({ ...note.sharing });
    selectElement.value = "none";
  }

  function SyncButton() {
    if (!note) return null;
    return (
      <button key="sync" onClick={handleSync} style={{ width: "fit-content" }} className={`flex items-center justify-center space-x-1 mod-cta m-0`}>
        <svg
          className={`w-4 h-4 ${updating ? "animate-spin" : ""} flex-shrink-0`}
          viewBox="0 0 42.676513671875 46.36460876464844"
          width="42.676513671875"
          height="46.36460876464844"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M 4.209 45.954 C 5.744 45.954 6.988 44.71 6.988 43.175 L 6.988 37.336 C 17.065 47.615 34.427 43.775 39.229 30.205 C 39.998 28.209 38.318 26.128 36.205 26.46 C 35.168 26.622 34.311 27.355 33.99 28.354 C 30.421 38.443 17.269 40.884 10.317 32.748 C 10.125 32.525 9.941 32.294 9.764 32.059 L 18.104 32.059 C 20.244 32.059 21.581 29.743 20.511 27.89 C 20.015 27.03 19.098 26.501 18.104 26.501 L 4.209 26.501 C 2.674 26.501 1.43 27.745 1.43 29.28 L 1.43 43.175 C 1.43 44.71 2.674 45.954 4.209 45.954 Z M 4.231 20.784 C 5.679 21.295 7.266 20.536 7.777 19.089 C 11.347 9 24.498 6.559 31.45 14.694 C 31.642 14.918 31.826 15.148 32.003 15.384 L 23.663 15.384 C 21.523 15.384 20.186 17.7 21.256 19.553 C 21.753 20.413 22.67 20.942 23.663 20.942 L 37.558 20.942 C 39.093 20.942 40.338 19.698 40.338 18.163 L 40.338 4.268 C 40.338 2.128 38.022 0.791 36.169 1.861 C 35.309 2.357 34.779 3.275 34.779 4.268 L 34.779 10.107 C 24.702 -0.172 7.34 3.668 2.539 17.238 C 2.028 18.685 2.787 20.273 4.234 20.784 Z"
            clipRule="evenodd"
            transform="matrix(-1, 0, 0, -1, 41.7680015563965, 47.43833541870118)"
          />
        </svg>
        <span className="flex-shrink-0 nowrap">{updating ? t("updating") : t("update")}</span>
      </button>
    );
  }

  function handleSync() {
    if (!publishing && !fileSynced && !fetching) {
      syncUp();
    }
  }

  function handleUnpublish() {
    if (confirm(t("areYouSure"))) {
      unpublish();
    }
  }

  function shares() {
    const children: JSX.Element[] = [];
    const closeButtonClasses = "rounded-md cursor-pointer hover:text-secondary focus:outline-none w-4 h-4 m-2";
    const { groups, peoples } = sharing;
    if (groups) {
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
    if (peoples) {
      peoples?.forEach((p) =>
        children.push(
          <div key={p._id.toString()} className="flex items-center py-1 pl-2 pr-1 mb-1 mr-1 truncate rounded-md bg-obs-tertiary">
            {peopleAvatar(p, 6)}
            <span className="ml-2 text-sm truncate whitespace-nowrap">{`${p.name || p.email}`}</span>
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
      <div className="flex flex-col p-2">
        <div className="my-2 text-secondary">{shares()}</div>
        <div className="w-full overflow-hidden truncate">
          <select ref={selectInput} className="min-w-full pl-2 pr-4 truncate dropdown" onChange={addSelectedUserOrGroup}>
            <option key="none" value="none">
              Add recipient
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
    );
  }

  function isSharedNote() {
    if (note?.sharing) {
      if (note.sharing.peoples && note.sharing.peoples.length > 0) {
        return true;
      }
      if (note.sharing.groups && note.sharing.groups.length > 0) {
        return true;
      }
    }
    return false;
  }

  function UpdateInfo() {
    const children: ReactChild[] = [];
    if (isSharedNote()) {
      if (!fileSynced) {
        children.push(<SyncButton key="sync" />);
      } else {
        children.push(
          <div key="sync" className="text-sm">
            Up to date
          </div>
        );
      }
      children.push(
        <button className="m-0 mt-2 cursor-pointer mod-cta" key="unpublish" style={{ width: "fit-content" }} onClick={handleUnpublish}>
          Remove from Sekund server
        </button>
      );
    }
    return children.length > 0 ? <div className="flex flex-col items-center w-full mt-6 mb-4">{children}</div> : null;
  }

  return (
    <NoActiveFile currentFile={currentFile}>
      <SharingOptions />
      <UpdateInfo />
    </NoActiveFile>
  );
}
