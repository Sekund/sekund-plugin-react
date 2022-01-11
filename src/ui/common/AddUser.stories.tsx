import { People } from "@/domain/People";
import AppContext from "@/state/AppContext";
import AppReducer, { initialAppState } from "@/state/AppReducer";
import AddUser from "@/ui/common/AddUser";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ObjectID from "bson-objectid";
import React, { useReducer } from "react";
import "/global.css";

export default {
  title: "Sekund/Add User",
  component: AddUser,
} as ComponentMeta<any>;

const Template: ComponentStory<any> = (args) => {
  const [appState, appDispatch] = useReducer(AppReducer, initialAppState);
  const appProviderState = {
    appState,
    appDispatch,
  };

  return (
    <AppContext.Provider value={appProviderState}>
      <div className="sekund">
        <AddUser usersService={args.usersService} permissionsService={args.permissionsService} done={() => {}} />
      </div>
    </AppContext.Provider>
  );
};

export const Example = Template.bind({});
Example.args = {
  usersService: {
    findUserByNameOrEmail(s: string) {
      if (s === "Thibault") {
        return { _id: new ObjectID(), name: "Thibault de Malempré", image: "https://joeschmoe.io/api/v1/a" };
      }
    },
  },
  permissionsService: {
    addContactRequest(user: People) {
      console.log("adding contact request", user);
    },
  },
};
