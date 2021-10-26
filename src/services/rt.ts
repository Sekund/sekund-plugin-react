import { AppAction, AppActionKind } from "@/state/AppReducer";
import { dispatch } from "@/utils";

export default async function watchEvents(dispatchers: React.Dispatch<AppAction>[], subdomain: string, user: Realm.User) {
  const events = user.mongoClient("mongodb-atlas").db(subdomain).collection("events");
  if (events) {
    console.log("watching events in plugin...");
    try {
      for await (const change of events.watch()) {
        switch (change.operationType) {
          case "insert": {
            const { documentKey, fullDocument } = change;
            dispatch(dispatchers, AppActionKind.SetEvent, fullDocument);
            break;
          }
        }
      }
    } catch (err) {
      console.log("ignoring errors", err);
    }
  }
}
