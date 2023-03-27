import React from "react";
import { Notification } from "@/domain/Notification";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import NotificationItem from "@/ui/v2/notifications/NotificationItem";
import "/global.css";
import ObjectID from "bson-objectid";
import peoples from "@/mockdata/PeoplesMock";
import {someNote} from "@/mockdata/NotesMock";

const me = peoples[0]
const incoming1 = peoples[1]


export default {
  title: "Sekund/Notification Update",
  component: NotificationItem,
} as ComponentMeta<typeof NotificationItem>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  return <div className="sekund"><NotificationItem notification={args.notification} /></div>
};

const now = Date.now();

export const NoteNotification = Template.bind({});
NoteNotification.args = {
    notification: {
      payload: someNote,
      category: 'note',
      details: {
        type: 'viewed',
        lastUpdate: now,
      }
  } as Notification
} ;

export const ContactNotification = Template.bind({});
ContactNotification.args = {
  notification: {
    category: "contact",
    details: {
      type: "request",
      payload: {
      _id: new ObjectID(),
      userId: me._id, // target user id
      userInfo: me, // target user info
      user: incoming1, // requesting user info
      created: now,
      updated: now,
      status: "requested",
      }
    }
  } as Notification,
}
