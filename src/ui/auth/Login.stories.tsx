import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import i18nConf from "../../i18n.config";
import { useTranslation } from "react-i18next";
import Login from "@/ui/auth/Login";

export default {
  title: "Sekund/Auth/Login",
  component: Login,
} as ComponentMeta<any>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const { i18n } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return (
    <div className="sekund">
      <div className="absolute inset-0 flex flex-col justify-center p-8">
        <Login {...args} />
      </div>
    </div>
  );
};

export const LoginPage = Template.bind({});
LoginPage.args = {
  workspaceId: "wicked-problems-ksbl",
  workspaceName: "wicked-problems",
};

export const LostPasswordPage = Template.bind({});
LostPasswordPage.args = {
  workspaceId: "wicked-problems-ksbl",
  workspaceName: "wicked-problems",
  sbPage: "lostPassword",
};
