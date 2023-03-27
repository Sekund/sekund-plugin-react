import { Notification, notificationTime } from "@/domain/Notification";
import NotificationItem from "@/ui/v2/notifications/NotificationItem";
import React from "react";

type Props = {
  notifications: Notification[];
};

export default function Notifications({ notifications }: Props) {
  console.log("Notifications Pane: notifications", notifications);
  return (
    <div className="flex flex-col pt-1 space-y-1">
      {notifications?.map((notification: Notification) => {
        const nTime = notificationTime(notification);
        return <NotificationItem notification={notification} key={nTime} />;
      })}
    </div>
  );
}
