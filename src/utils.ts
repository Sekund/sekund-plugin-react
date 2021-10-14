import * as Realm from "realm-web";
import { AppContextType } from "src/state/AppContext";
import { AppAction, AppActionKind, GeneralState, NoteState } from "src/state/AppReducer";

export async function getApiKeyConnection(realmApp: Realm.App, apiKey: string): Promise<Realm.User | null> {
  const credentials = Realm.Credentials.apiKey(apiKey);
  try {
    return await realmApp.logIn(credentials);
  } catch (err) {
    return null;
  }
}

export function setGeneralState(appDispatch: React.Dispatch<AppAction>, gState: GeneralState) {
  appDispatch({ type: AppActionKind.SetGeneralState, payload: gState });
}

export function setCurrentNoteState(appDispatch: React.Dispatch<AppAction>, nState: Partial<NoteState>) {
  appDispatch({ type: AppActionKind.SetNoteState, payload: nState });
}
