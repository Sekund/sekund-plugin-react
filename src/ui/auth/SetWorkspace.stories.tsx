import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import i18nConf from "../../i18n.config";
import { useTranslation } from "react-i18next";
import SetWorkspace from "@/ui/auth/SetWorkspace";

export default {
  title: "Sekund/Auth/Set Workspace",
  component: SetWorkspace,
} as ComponentMeta<any>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  const { i18n } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return (
    <div className="sekund">
      <div className="absolute inset-0 flex flex-col justify-center p-8">
        <SetWorkspace {...args} />
      </div>
    </div>
  );
};

export const Example = Template.bind({});
Example.args = {
  workspaceId: "wicked-problems",
};
