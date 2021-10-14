import { EventsAction, EventsActionKind } from "@/state/EventsReducer";

export default async function watchEvents(eventsDispatch: React.Dispatch<EventsAction>, subdomain: string, user: Realm.User) {
  const events = user.mongoClient("mongodb-atlas").db(subdomain).collection("events");
  if (events) {
    console.log("watching events...");
    try {
      for await (const change of events.watch()) {
        switch (change.operationType) {
          case "insert": {
            const { documentKey, fullDocument } = change;
            eventsDispatch({ type: EventsActionKind.SetEvent, payload: fullDocument });
            break;
          }
        }
      }
    } catch (err) {
      console.log("ignoring errors", err);
    }
  }
}
