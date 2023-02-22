import { Group } from "@/domain/Group";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import { useAppContext } from "@/state/AppContext";
import { AdjustmentsIcon } from "@heroicons/react/solid";
import { AvatarGroup } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  group: Group;
  editGroup: (group: Group) => void;
  displayGroup: (group: Group) => void;
};

export default function SekundGroupSummary({ group, editGroup, displayGroup }: Props) {
  const { t } = useTranslation();
  const { appState } = useAppContext();
  const { userProfile } = appState;

  // useEffect(() => {
  //   const listenerId = makeid(5);
  //   const eventsWatcher = EventsWatcherService.instance;
  //   eventsWatcher?.watchEvents();
  //   eventsWatcher?.addEventListener(
  //     listenerId,
  //     new SekundEventListener(["modifySharingGroups", "note.delete"], async () => {
  //       await fetchGroupNotes();
  //     })
  //   );
  //   return () => {
  //     eventsWatcher?.removeEventListener(listenerId);
  //   };
  // }, []);

  function groupMembers(group: Group): JSX.Element {
    const editAllowed = group.userId.equals(userProfile._id);
    return (
      <div
        className="flex items-center flex-shrink-0 p-1 ml-1 space-x-1 overflow-hidden cursor-pointer"
        onClick={editAllowed ? () => editGroup(group) : () => displayGroup(group)}
      >
        <AvatarGroup className="h-6" sx={{ height: 24 }}>
          {group.peoples.map((people) => peopleAvatar(people, 6))}
        </AvatarGroup>
        <AdjustmentsIcon className="flex-shrink-0 w-4 h-4 mr-1" />
      </div>
    );
  }

  // function badge() {
  //   let count = 0;
  //   for (const groupNote of unreadNotes.groups) {
  //     if (groupNote.sharing.groups) {
  //       for (const noteGroup of groupNote.sharing.groups) {
  //         if ((noteGroup as unknown as ObjectID).equals(group._id)) {
  //           count += 1;
  //         }
  //       }
  //     }
  //   }
  //   return count;
  // }

  return (
    <div className="flex flex-col" style={{ borderRight: "none", borderLeft: "none" }}>
      <div
        key={group._id.toString()}
        className="flex items-center justify-between w-full mx-auto cursor-pointer bg-obs-primary-alt hover:bg-obs-primary"
      >
        <div className="flex items-center px-3 py-2 space-x-2 overflow-hidden text-sm cursor-pointer">
          <div className="flex">{groupAvatar(group, 10 /*, badge()*/)}</div>
          <div className="truncate text-md text-primary hover:underline" onClick={() => displayGroup(group)}>
            {group.name}
          </div>
        </div>
        <div className="flex">{groupMembers(group)}</div>
      </div>
    </div>
  );
}
