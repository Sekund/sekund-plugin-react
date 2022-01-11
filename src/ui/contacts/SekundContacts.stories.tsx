import { People } from "@/domain/People";
import { PermissionRequestStatus, SharingPermission } from "@/domain/SharingPermission";
import { someone } from "@/mockdata/PeoplesMock";
import AppContext from "@/state/AppContext";
import AppReducer, { AppActionKind, initialAppState } from "@/state/AppReducer";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ObjectID from "bson-objectid";
import React, { useReducer } from "react";
import SekundContacts from "./SekundContacts";
import "/global.css";

export default {
  title: "Sekund/Contacts",
  component: SekundContacts,
} as ComponentMeta<any>;

const peoples = [
  { _id: new ObjectID(), name: "Thibault de Malempré", image: "https://joeschmoe.io/api/v1/a" },
  { _id: new ObjectID(), name: "Mephistophniel Nathanielflame", image: "https://joeschmoe.io/api/v1/b" },
  { _id: new ObjectID(), name: "Bobspencer Griffinmoondancer", image: "https://joeschmoe.io/api/v1/c" },
  { _id: new ObjectID(), name: "Mediri Nicholswalker", image: "https://joeschmoe.io/api/v1/d" },
  { _id: new ObjectID(), name: "Chewturca The Medinatt", image: "https://joeschmoe.io/api/v1/e" },
  { _id: new ObjectID(), name: "Bobanderson Mormoondancer", image: "https://joeschmoe.io/api/v1/f" },
  { _id: new ObjectID(), name: "Gorilbo Youngaggins Forestjohnston", image: "https://joeschmoe.io/api/v1/g" },
  { _id: new ObjectID(), name: "Wrightgobble", image: "https://joeschmoe.io/api/v1/h" },
];

const permissions = [
  {
    _id: new ObjectID(),
    user: peoples[0],
    status: "requested",
    created: Date.now(),
    updated: Date.now(),
    userId: new ObjectID(),
    userInfo: someone,
  },
  {
    _id: new ObjectID(),
    user: peoples[1],
    status: "accepted",
    created: Date.now(),
    updated: Date.now(),
    userId: new ObjectID(),
    userInfo: someone,
  },
  {
    _id: new ObjectID(),
    user: peoples[2],
    status: "accepted",
    created: Date.now(),
    updated: Date.now(),
    userId: new ObjectID(),
    userInfo: someone,
  },
  {
    _id: new ObjectID(),
    user: peoples[3],
    status: "rejected",
    created: Date.now(),
    updated: Date.now(),
    userId: new ObjectID(),
    userInfo: someone,
  },
  {
    _id: new ObjectID(),
    user: peoples[4],
    status: "blocked",
    created: Date.now(),
    updated: Date.now(),
    userId: new ObjectID(),
    userInfo: someone,
  },
] as SharingPermission[];

const Template: ComponentStory<any> = (args) => {
  const [appState, appDispatch] = useReducer(AppReducer, { ...initialAppState, userProfile: someone });
  const appProviderState = {
    appState,
    appDispatch,
  };

  return (
    <AppContext.Provider value={appProviderState}>
      <div className="sekund">
        <SekundContacts permissionsService={args.permissionsService} permissions={permissions} close={() => {}} />
      </div>
    </AppContext.Provider>
  );
};

export const Example = Template.bind({});
Example.args = {
  permissionsService: {
    getPermissions() {
      permissions;
    },
    setStatus(sp: SharingPermission, status: PermissionRequestStatus) {
      console.log("setting status", sp, status);
    },
  },
};

export const NoContacts = Template.bind({});
NoContacts.args = {
  permissionsService: {
    getPermissions() {
      return [];
    },
    setStatus(sp: SharingPermission, status: PermissionRequestStatus) {
      console.log("setting status", sp, status);
    },
  },
};
