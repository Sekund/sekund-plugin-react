import { someNote } from "@/mockdata/NotesMock";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import "/global.css";

import UpdateItem from "@/ui/v2/notifications/UpdateItem";
import ObjectID from "bson-objectid";
import React from "react";

export default {
  title: "Sekund/Notification Update",
  component: UpdateItem,
} as ComponentMeta<typeof UpdateItem>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  return <UpdateItem update={args.update} />;
};

export const NoteUpdate = Template.bind({});
NoteUpdate.args = {
  update: {
    id: new ObjectID().toString(),
    type: "note",
    time: Date.now(),
    data: { ...someNote },
  },
};
