export type EventsState = {
  event: any;
};

export const initialEventsState: EventsState = {
  event: undefined,
};

export enum EventsActionKind {
  SetEvent,
  Consume,
}

export type EventsAction = {
  type: EventsActionKind;
  payload: any;
};

export default function PeopleReducer(state: EventsState, action: EventsAction): EventsState {
  const { type, payload } = action;

  switch (type) {
    case EventsActionKind.SetEvent:
      return { ...state, event: payload };
    case EventsActionKind.Consume:
      return { ...state, event: undefined };

    default:
      return state;
  }
}
