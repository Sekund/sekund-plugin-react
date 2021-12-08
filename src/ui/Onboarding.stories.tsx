import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import Onboarding from "./Onboarding";
import i18nConf from "../i18n.config";
import { useTranslation } from "react-i18next";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Sekund/Onboarding",
  component: Onboarding,
} as ComponentMeta<any>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const { i18n } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return (
    <div className="sekund">
      <div className="fixed inset-0 flex flex-col items-center justify-center p-8 sekund">
        <Onboarding {...args} />
      </div>
    </div>
  );
};

export const Welcome = Template.bind({});
Welcome.args = {
  sbPage: "welcome",
  workspaceId: "Sekund",
};

export const ChooseTeam = Template.bind({});
ChooseTeam.args = {
  sbPage: "chooseWorkspace",
  workspaceId: "wicked-problems",
};

export const ChooseNextStep = Template.bind({});
ChooseNextStep.args = {
  sbPage: "chooseNextStep",
  sbWorkspace: "wicked-problems",
};

export const Login = Template.bind({});
Login.args = {
  sbPage: "login",
  workspaceId: "wicked-problems",
};

export const Register = Template.bind({});
Register.args = {
  sbPage: "register",
  workspaceId: "wicked-problems",
};
