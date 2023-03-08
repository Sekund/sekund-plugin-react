import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import { SharingPermission } from "@/domain/SharingPermission";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import PeoplesService from "@/services/PeoplesService";
import PermissionsService from "@/services/PermissionsService";
import { useAppContext } from "@/state/AppContext";
import SekundPublicGroupSummary from "@/ui/groups/SekundPublicGroupSummary";
import LinkButton from "@/ui/v2/common/LinkButton";
import InactiveContactSummary from "@/ui/v2/contacts/InactiveContactSummary";
import SekundGroupSummary from "@/ui/v2/contacts/SekundGroupSummary";
import SekundPersonSummary from "@/ui/v2/contacts/SekundPersonSummary";
import { ContactsMgmtCallbacks } from "@/ui/v2/MainPanelWrapper";
import { makeid } from "@/utils";
import { ArrowLeftIcon, PlusIcon, SearchIcon, UserCircleIcon } from "@heroicons/react/solid";
import { ArrowRightAlt } from "@mui/icons-material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

type Props = {
  peoplesService?: PeoplesService;
  active: boolean;
  callbacks: ContactsMgmtCallbacks;
};

type Contact =
  | {
      type: "people";
      name: string;
      data: People;
      permission: SharingPermission;
    }
  | {
      type: "group";
      name: string;
      data: Group;
    }
  | {
      type: "pending";
      name: string;
      data: SharingPermission;
    };

export default function ContactsMgmt({ active, peoplesService, callbacks }: Props) {
  const { appState } = useAppContext();
  const { generalState } = appState;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [showPublicGroups, setShowPublicGroups] = useState(false);
  const [contactRequests, setContactRequests] = useState<SharingPermission[]>([]);
  const [blockedContacts, setBlockedContacts] = useState<SharingPermission[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollable = useRef<HTMLDivElement>(null);

  const { userProfile } = appState;

  const handleScroll = debounce(() => {
    if (scrollable.current) {
      const position = scrollable.current.scrollTop;
      setScrollPosition(position);
    }
  }, 50);

  useEffect(() => {
    const permissionsListenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    if (active && generalState === "allGood") {
      eventsWatcher?.addEventListener(permissionsListenerId, new SekundEventListener(["permissions.changed"], loadContacts));

      loadContacts();
    }

    if (scrollable.current) {
      setTimeout(() => {
        scrollable.current?.addEventListener("scroll", handleScroll, { passive: true })
      }, 1000);
    }
    return () => {
      scrollable.current?.removeEventListener("scroll", handleScroll);
      eventsWatcher?.removeEventListener(permissionsListenerId);
    };
  }, [active]);

  useEffect(() => {
    if (active && scrollable.current) {
      scrollable.current.scrollTo(0, scrollPosition);
    }
  });

  function isIncomingRequest(sharingPermission: SharingPermission) {
    return sharingPermission.status === "requested" && sharingPermission.userId.equals(userProfile._id);
  }

  async function loadContacts() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }

    const groups = await peoplesService.getUserGroups();
    const peoples = await peoplesService.getPeoples();
    const permissions = await PermissionsService.instance.getPermissions();

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
        permission: permissions.find((p) => p.userId.equals(people._id))!,
      });
    });
    permissions.forEach((p) => {
      if (p.status === "requested" && !isIncomingRequest(p)) {
        contacts.push({
          type: "pending",
          name: p.userInfo.name || p.userInfo.email!,
          data: p,
        });
      }
    });

    // sort contacts by name
    contacts.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setContacts(contacts);

    setContactRequests(permissions.filter((p) => p.status === "requested" && isIncomingRequest(p)));
    setBlockedContacts(permissions.filter((p) => p.status === "blocked"));
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

  function ContactRequests() {
    return (
      <>
        <div className="py-1 text-center">Contact Requests</div>
        <div className="divide-x-0 divide-y divide-solid divide-obs-modal">
          {contactRequests.map((sharingPermission: SharingPermission) => (
            <InactiveContactSummary key={sharingPermission._id.toString()} sharingPermission={sharingPermission} />
          ))}
        </div>
      </>
    );
  }

  function BlockedContacts() {
    return (
      <>
        <div className="py-1 text-center">Blocked Contacts</div>
        <div className="divide-x-0 divide-y divide-solid divide-obs-modal">
          {blockedContacts.map((sharingPermission: SharingPermission) => (
            <InactiveContactSummary key={sharingPermission._id.toString()} sharingPermission={sharingPermission} />
          ))}
        </div>
      </>
    );
  }

  function InactiveContacts({ status }: { status: "pending" | "blocked" }) {
    return <div className={`${status === "pending" ? "" : "mt-8"}`}>{status === "pending" ? <ContactRequests /> : <BlockedContacts />}</div>;
  }

  const { editPerson, editGroup, showSettings, addUser, createGroup, openGroupIndex, openPersonIndex } = callbacks;

  function ContactSummary(contact: Contact) {
    switch (contact.type) {
      case "group":
        return (
          <SekundGroupSummary
            key={contact.data._id.toString()}
            group={contact.data as Group}
            displayGroup={() => openGroupIndex(contact.data as Group)}
            editGroup={() => editGroup(contact.data as Group, loadContacts)}
          />
        );
      case "people":
        return (
          <SekundPersonSummary
            key={contact.data._id.toString()}
            person={contact.data as People}
            displayPerson={() => openPersonIndex(contact.data as People)}
            editPerson={() => editPerson(contact.data as People, contact.permission, loadContacts)}
          />
        );
      case "pending":
        return <InactiveContactSummary key={contact.data._id.toString()} sharingPermission={contact.data as SharingPermission} />;
    }
  }

  return showPublicGroups ? (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex flex-col flex-grow overflow-auto space-y-1px">
        {publicGroups.map((group: Group) => (
          <SekundPublicGroupSummary key={group._id.toString()} group={group} />
        ))}
      </div>
      <div className="grid flex-shrink-0 grid-cols-2 p-2 gap-y-2">
        <LinkButton icon={<ArrowLeftIcon className="w-4 h-4" />} onClick={() => hidePublicGroups()}>
          Back
        </LinkButton>
      </div>
    </div>
  ) : (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex flex-col flex-grow overflow-auto" ref={scrollable} id="my-scrollable">
        {contactRequests.length > 0 ? <InactiveContacts status={"pending"} /> : null}

        {contacts.map((contact: Contact) => {
          return ContactSummary(contact);
        })}

        {blockedContacts.length > 0 ? <InactiveContacts status="blocked" /> : null}
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
