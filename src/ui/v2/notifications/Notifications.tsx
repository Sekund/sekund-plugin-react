import NotificationsContext from "@/state/NotificationsContext";
import NotificationsPanel from "@/ui/v2/notifications/NotificationsPanel";
import React from "react";

export default function Notifications() {
  const { notificationsState } = React.useContext(NotificationsContext);
  const { notifications } = notificationsState || [];

  return <NotificationsPanel notifications={notifications} />;
}
