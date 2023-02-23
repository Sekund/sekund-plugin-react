import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import SekundPublicGroupSummary from "@/ui/groups/SekundPublicGroupSummary";
import LinkButton from "@/ui/v2/common/LinkButton";
import SekundGroupSummary from "@/ui/v2/contacts/SekundGroupSummary";
import SekundPersonSummary from "@/ui/v2/contacts/SekundPersonSummary";
import { ContactsMgmtCallbacks } from "@/ui/v2/MainPanel";
import { ArrowLeftIcon, PlusIcon, SearchIcon, UserCircleIcon } from "@heroicons/react/solid";
import { ArrowRightAlt } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

type Props = {
  peoplesService?: PeoplesService;
  active: boolean;
  callbacks: ContactsMgmtCallbacks;
};

type Contact = {
  type: "group" | "people";
  name: string;
  data: People | Group;
};

export default function ContactsMgmt({ active, peoplesService, callbacks }: Props) {
  const { appState } = useAppContext();
  const { generalState } = appState;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [showPublicGroups, setShowPublicGroups] = useState(false);

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

  async function loadPublicGroups() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }
    const pGroups = await peoplesService.getPublicGroups();
    setShowPublicGroups(true);
    setPublicGroups(pGroups);
  }

  function hidePublicGroups() {
    setShowPublicGroups(false);
    loadContacts();
  }

  const { displayPerson, displayGroup, editPerson, editGroup, showSettings, addUser, createGroup } = callbacks;

  function UserContacts() {
    return (
      <div className="absolute inset-0 flex flex-col">
        <div className="flex flex-col flex-grow overflow-auto space-y-1px">
          {contacts.map((contact: Contact) => {
            return contact.type === "group" ? (
              <SekundGroupSummary
                key={contact.data._id.toString()}
                group={contact.data as Group}
                editGroup={() => editGroup(contact.data as Group, loadContacts)}
                displayGroup={displayGroup}
              />
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
          <LinkButton icon={<PlusIcon className="w-4 h-4" />} onClick={() => createGroup(loadContacts)}>
            Create group
          </LinkButton>
          <LinkButton className="justify-end mr-2" icon={<SearchIcon className="w-4 h-4" />} onClick={() => addUser()}>
            Find People
          </LinkButton>
          <LinkButton icon={<ArrowRightAlt className="w-4 h-4" />} onClick={() => loadPublicGroups()}>
            Join public group
          </LinkButton>
          <LinkButton className="justify-end mr-2" icon={<UserCircleIcon className="w-4 h-4" />} onClick={() => showSettings()}>
            My profile
          </LinkButton>
        </div>
      </div>
    );
  }

  function PublicGroups() {
    return (
      <div className="absolute inset-0 flex flex-col">
        <div className="flex flex-col flex-grow overflow-auto space-y-1px">
          {publicGroups.map((group: Group) => (
            <SekundPublicGroupSummary key={group._id.toString()} group={group} displayGroup={displayGroup} />
          ))}
        </div>
        <div className="grid flex-shrink-0 grid-cols-2 p-2 gap-y-2">
          <LinkButton icon={<ArrowLeftIcon className="w-4 h-4" />} onClick={() => hidePublicGroups()}>
            Back
          </LinkButton>
        </div>
      </div>
    );
  }

  return showPublicGroups ? <PublicGroups /> : <UserContacts />;
}
