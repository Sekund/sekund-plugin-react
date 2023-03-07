import { People } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import { InformationCircleIcon } from "@heroicons/react/outline";
import React from "react";

type Props = {
  person: People;
  editPerson: (person: People) => void;
  displayPerson: (person: People) => void;
};

export default function SekundPeopleSummary({ person, editPerson, displayPerson }: Props) {
  return (
    <div className="flex flex-col" style={{ borderRight: "none", borderLeft: "none" }}>
      <div
        key={person._id.toString()}
        className="flex items-center justify-between w-full mx-auto cursor-pointer bg-obs-primary-alt hover:bg-obs-primary"
      >
        <div className="flex items-center px-3 py-2 space-x-2 overflow-hidden text-sm cursor-pointer">
          <div className="flex">{peopleAvatar(person, 10)}</div>
          <div className="truncate text-md text-primary hover:underline" onClick={() => displayPerson(person)}>
            {person.name || person.email}
          </div>
        </div>
        <InformationCircleIcon onClick={() => editPerson(person)} className="flex-shrink-0 w-6 h-6 mr-1" />
      </div>
    </div>
  );
}
