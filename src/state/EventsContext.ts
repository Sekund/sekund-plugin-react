import React from "react";
import { EventsAction, EventsState } from "./EventsReducer";

type EventsContextType = {
  eventsState: EventsState;
  eventsDispatch: React.Dispatch<EventsAction>;
};

const EventsContext = React.createContext({} as EventsContextType);

export function useEventsContext() {
  return React.useContext(EventsContext);
}

export default EventsContext;
