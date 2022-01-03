import React, { useReducer } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import "/global.css";

import SekundContacts from "./SekundContacts";
import AppReducer, { initialAppState } from "@/state/AppReducer";
import AppContext from "@/state/AppContext";
import PermissionsService from "@/services/PermissionsService";
import ObjectID from "bson-objectid";
import { PermissionRequestStatus, SharingPermission } from "@/domain/SharingPermission";

export default {
  title: "Sekund/Contacts",
  component: SekundContacts,
} as ComponentMeta<any>;

// export interface SharingPermission {
//   _id: ObjectID;
//   user?: People;
//   group?: Group;
//   status: PermissionRequestStatus;
//   created: number;
//   updated: number;
// }

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

const Template: ComponentStory<any> = (args) => {
  const [appState, appDispatch] = useReducer(AppReducer, initialAppState);
  const appProviderState = {
    appState,
    appDispatch,
  };
  const permissionsService = {
    getPermissions() {
      return [
        {
          _id: new ObjectID(),
          user: peoples[0],
          status: "requested",
          created: Date.now(),
          update: Date.now(),
        },
        {
          _id: new ObjectID(),
          user: peoples[1],
          status: "accepted",
          created: Date.now(),
          update: Date.now(),
        },
        {
          _id: new ObjectID(),
          user: peoples[2],
          status: "accepted",
          created: Date.now(),
          update: Date.now(),
        },
        {
          _id: new ObjectID(),
          user: peoples[3],
          status: "rejected",
          created: Date.now(),
          update: Date.now(),
        },
        {
          _id: new ObjectID(),
          user: peoples[4],
          status: "blocked",
          created: Date.now(),
          update: Date.now(),
        },
      ];
    },
    setStatus(sp: SharingPermission, status: PermissionRequestStatus) {
      console.log("setting status", sp, status);
    },
  } as unknown as PermissionsService;
  return (
    <AppContext.Provider value={appProviderState}>
      <div className="sekund">
        <SekundContacts permissionsService={permissionsService} close={() => {}} />
      </div>
    </AppContext.Provider>
  );
};

export const Example = Template.bind({});
Example.args = {};
