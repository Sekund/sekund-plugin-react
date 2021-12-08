import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import i18nConf from "../../i18n.config";
import { useTranslation } from "react-i18next";
import Register from "@/ui/auth/Register";

export default {
  title: "Sekund/Auth/Register",
  component: Register,
} as ComponentMeta<any>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const { i18n } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return (
    <div className="sekund">
      <div className="fixed inset-0 flex flex-col justify-center p-8">
        <Register {...args} />
      </div>
    </div>
  );
};

export const RegisterPage = Template.bind({});
RegisterPage.args = {
  workspaceId: "wicked-problems-ksbl",
  workspaceName: "wicked-problems",
};

export const LinkSentPage = Template.bind({});
LinkSentPage.args = {
  workspaceId: "wicked-problems-ksbl",
  workspaceName: "wicked-problems",
  sbPage: "confirmationLinkSent",
};
