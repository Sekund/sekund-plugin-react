import { contactRequestNotification, noteViewedNotification } from "@/mockdata/NotificationsMock";
import NotificationsContext from "@/state/NotificationsContext";
import { initialNotificationsState, NotificationsState } from "@/state/NotificationsReducer";
import Notifications from "@/ui/v2/notifications/Notifications";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { withReactContext } from "storybook-react-context";
import "/global.css";

export default {
  title: "Sekund/Notifications (v2)",
  component: Notifications,
  decorators: [
    withReactContext({
      Context: NotificationsContext,
      initialState: initialNotificationsState,
    }),
  ],
} as ComponentMeta<typeof Notifications>;

const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  return (
    <div className="sekund">
      <Notifications />
    </div>
  );
};

export const StaticInitialContext = () => <Notifications />;
StaticInitialContext.parameters = {
  reactContext: {
    initialState: { notifications: [noteViewedNotification, contactRequestNotification] },
  },
};

export const SomeNotifications = Template.bind({});
SomeNotifications.parameters = {
  reactContext: {
    initialState: {
      notifications: [noteViewedNotification, contactRequestNotification],
    },
    // useProviderValue: (state: NotificationsState, args: any) => {
    //   console.log("state.notifications", state, args);
    //   state.notifications = args.notifications;
    // },
  },
};

SomeNotifications.args = {
  notifications: [noteViewedNotification, contactRequestNotification],
};
