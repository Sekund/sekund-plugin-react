import { Note } from "@/domain/Note";
import AppContext from "@/state/AppContext";
import AppReducer from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import NoteComments from "@/ui/note/NoteComments";
import { makeid } from "@/utils";
import React, { useReducer } from "react";

type Props = {
  note: Note;
};

export default function DiscussionBlock({ note }: Props) {
  const localizedAppState = window.moment
    ? { ...GlobalState.instance.appState, id: makeid(3), locale: (window.moment as any).locale() }
    : { ...GlobalState.instance.appState, id: makeid(3) };

  const [appState, appDispatch] = useReducer(AppReducer, localizedAppState);
  const appProviderState = {
    appState,
    appDispatch,
  };

  return (
    <div className="sekund">
      <AppContext.Provider value={appProviderState}>
        <NoteComments note={note} className="discussion" />
      </AppContext.Provider>
    </div>
  );
}
