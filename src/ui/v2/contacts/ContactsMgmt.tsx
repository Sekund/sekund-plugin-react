import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import LinkButton from "@/ui/v2/common/LinkButton";
import SekundGroupSummary from "@/ui/v2/contacts/SekundGroupSummary";
import SekundPersonSummary from "@/ui/v2/contacts/SekundPersonSummary";
import { PlusIcon, SearchIcon, UserCircleIcon } from "@heroicons/react/solid";
import { ArrowRightAlt } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

type Props = {
  peoplesService?: PeoplesService;
  active: boolean;
  addUser: () => void;
  showSettings: () => void;
};

type Contact = {
  type: "group" | "people";
  name: string;
  data: People | Group;
};

export default function ContactsMgmt({ active, peoplesService, addUser, showSettings }: Props) {
  const { appState } = useAppContext();
  const { generalState } = appState;
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (active && generalState === "allGood") {
      loadContacts();
    }
  }, [active]);

  async function loadContacts() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }

    const groups = await peoplesService.getUserGroups();
    const peoples = await peoplesService.getPeoples();

    const contacts: Contact[] = [];
    groups.forEach((group) => {
      contacts.push({
        type: "group",
        name: group.name,
        data: group,
      });
    });
    peoples.forEach((people) => {
      contacts.push({
        type: "people",
        name: people.name || people.email!,
        data: people,
      });
    });

    // sort contacts by name
    contacts.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setContacts(contacts);
  }

  function displayGroup(group: Group) {
    console.log("display group", group);
  }

  function displayPerson(people: People) {
    console.log("display people", people);
  }

  function editGroup(group: Group) {
    console.log("edit group", group);
  }

  function editPerson(people: People) {
    console.log("edit people", people);
  }

  function createGroup() {
    console.log("create group");
  }

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex flex-col flex-grow overflow-auto space-y-1px">
        {contacts.map((contact: Contact) => {
          return contact.type === "group" ? (
            <SekundGroupSummary key={contact.data._id.toString()} group={contact.data as Group} editGroup={editGroup} displayGroup={displayGroup} />
          ) : (
            <SekundPersonSummary
              key={contact.data._id.toString()}
              person={contact.data as People}
              displayPerson={displayPerson}
              editPerson={editPerson}
            />
          );
        })}
      </div>
      <div className="grid flex-shrink-0 grid-cols-2 p-2 gap-y-2">
        <LinkButton icon={<PlusIcon className="w-4 h-4" />} onClick={createGroup}>
          Create group
        </LinkButton>
        <LinkButton className="justify-end mr-2" icon={<SearchIcon className="w-4 h-4" />} onClick={() => addUser()}>
          Find People
        </LinkButton>
        <LinkButton icon={<ArrowRightAlt className="w-4 h-4" />} onClick={createGroup}>
          Join public group
        </LinkButton>
        <LinkButton className="justify-end mr-2" icon={<UserCircleIcon className="w-4 h-4" />} onClick={() => showSettings()}>
          My profile
        </LinkButton>
      </div>
    </div>
  );
}
