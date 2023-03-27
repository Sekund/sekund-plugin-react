import { NotificationsAction, NotificationsState } from "@/state/NotificationsReducer";
import React from "react";

export type NotificationsContextType = {
  notificationsState: NotificationsState;
  notificationsDispatch: React.Dispatch<NotificationsAction>;
};

const NotificationsContext = React.createContext({} as NotificationsContextType);

export function useNotificationsContext() {
  return React.useContext(NotificationsContext);
}

export default NotificationsContext;
