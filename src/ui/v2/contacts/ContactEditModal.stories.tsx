import { People } from "@/domain/People";
import { someone } from "@/mockdata/PeoplesMock";
import AppContext from "@/state/AppContext";
import AppReducer, { initialAppState } from "@/state/AppReducer";
import ContactEditModal from "@/ui/v2/contacts/ContactEditModal";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, { useReducer } from "react";
import "/global.css";

export default {
  title: "Sekund/Contact Display (v2)",
  component: ContactEditModal,
} as ComponentMeta<typeof ContactEditModal>;

const person = someone as unknown as People;
person.twitterHandle = "sekund_io";
person.personalPage = "https://sekund.io/celene";
person.bio =
  "played an indispensable role in adopting and ratifying the Constitution of the United States, which replaced the Articles of Confederation in 1789 and remains the world's longest-standing written and codified national constitution to this day.";
person.linkedInPage = "https://www.linkedin.com/in/williamhgates/";

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const [appState, appDispatch] = useReducer(AppReducer, { ...initialAppState, userProfile: someone });
  const appProviderState = {
    appState,
    appDispatch,
  };

  return (
    <AppContext.Provider value={appProviderState}>
      <div className="sekund">
        <ContactEditModal closeDialog={() => {}} person={someone} />
      </div>
    </AppContext.Provider>
  );
};

export const Example = Template.bind({});
