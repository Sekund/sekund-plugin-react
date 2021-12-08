import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import i18nConf from "../../i18n.config";
import { useTranslation } from "react-i18next";
import ResetPassword from "@/ui/auth/ResetPassword";

export default {
  title: "Sekund/Auth/Reset password",
  component: ResetPassword,
} as ComponentMeta<any>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const { i18n } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return (
    <div className="sekund">
      <div className="fixed inset-0 flex flex-col justify-center p-8">
        <ResetPassword {...args} />
      </div>
    </div>
  );
};

export const ResetPasswordPage = Template.bind({});
ResetPasswordPage.args = {
  workspaceName: "wicked-problems",
};

export const LinkSentPage = Template.bind({});
LinkSentPage.args = {
  workspaceName: "wicked-problems",
  sbPage: "resetLinkSent",
};
