import React, { useReducer } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import "/global.css";

import SekundSettings from "./SekundSettings";
import AppReducer, { initialAppState } from "@/state/AppReducer";
import AppContext from "@/state/AppContext";

export default {
  title: "Sekund/Settings",
  component: SekundSettings,
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
        <SekundSettings {...args} />
      </div>
    </AppContext.Provider>
  );
};

export const Example = Template.bind({});
Example.args = {};
