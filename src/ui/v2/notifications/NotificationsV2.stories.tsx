import { Note } from "@/domain/Note";
import { SharingPermission } from "@/domain/SharingPermission";
import { someNote } from "@/mockdata/NotesMock";
import peoples from "@/mockdata/PeoplesMock";
import NotificationsContext from "@/state/NotificationsContext";
import { reduceUpdate, UpdateKey } from "@/state/NotificationsReducer";
import NotificationsPanel from "@/ui/v2/notifications/NotificationsPanel";
import ObjectID from "bson-objectid";
import React from "react";
import { withReactContext } from "storybook-react-context";

const me = peoples[0];
const incoming1 = peoples[1];

export default {
  title: "Sekund/Notifications (v3)",
  decorators: [
    withReactContext({
      Context: NotificationsContext,
      initialState: { notifications: [] },
    }),
  ],
  parameters: {
    options: {
      showPanel: false,
    },
  },
};

// Setup

const PureComponent = ({ children, notifications }) => (
  <div className="max-w-sm p-4 font-sans bg-white rounded shadow-lg">
    {children}
    <div className="sekund">
      <NotificationsPanel notifications={notifications} />
    </div>
  </div>
);

const ComponentWithContext = ({ children }) => {
  const ctx = React.useContext(NotificationsContext);
  const state = Array.isArray(ctx) ? ctx[0] : (ctx as unknown as any).state || ctx;
  // Either a tuple from reducer, object from the custom provider hook or initialState
  return <PureComponent {...state}>{children}</PureComponent>;
};

const Toolbar = ({ onAdd, onReset }) => (
  <div className="sekund">
    <div className="absolute bottom-0 left-0 right-0 max-w-sm p-2 bg-gray-500 rounded">
      <button
        type="button"
        onClick={() => {
          onAdd();
        }}
        id="context-button"
      >
        Ajouter notification
      </button>
      <button type="button" onClick={onReset} id="context-button">
        Reset
      </button>
    </div>
  </div>
);

let notificationIndex = -1;

type UpdateParams = { payload: Note | SharingPermission; updateKey: UpdateKey };
const now = Date.now();

const allUpdates: UpdateParams[] = [
  { payload: someNote, updateKey: UpdateKey.NOTE_ADD_COMMENT },
  {
    payload: {
      _id: new ObjectID(),
      userId: me._id, // target user id
      userInfo: me, // target user info
      user: incoming1, // requesting user info
      created: now,
      updated: now,
      status: "requested",
    } as SharingPermission,
    updateKey: UpdateKey.CONTACT_REQUEST,
  },
];

export const ChangeOnInteraction = (_, { context: [notificationsState, setNotificationsState] }) => {
  return (
    <>
      <ComponentWithContext>
      </ComponentWithContext>
      <Toolbar
        onAdd={() => {
          notificationIndex += 1;
          if (notificationIndex === allUpdates.length) {
            notificationIndex = -1;
          }
          const { payload, updateKey } = allUpdates[notificationIndex];
          const updatedNotifications = reduceUpdate([...notificationsState.notifications], payload, updateKey);
          setNotificationsState({ notifications: updatedNotifications });
        }}
        onReset={() => {
          notificationIndex = -1;
          setNotificationsState({ notifications: [] });
        }}
      />
    </>
  );
};

ChangeOnInteraction.parameters = {
  reactContext: {
    reducer: (state, action) => {
      console.log("Reducer is called with ", state, "action", action);
      return {
        ...state,
        ...action,
      };
    },
  },
};
