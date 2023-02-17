import { Note } from "@/domain/Note";
import NoteSyncService from "@/services/NoteSyncService";
import PeoplesService from "@/services/PeoplesService";
import AppContext from "@/state/AppContext";
import AppReducer from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesAction, NotesActionKind, NotesState } from "@/state/NotesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import { makeid, touch } from "@/utils";
import { SparklesIcon } from "@heroicons/react/solid";
import React, { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  contactId: string;
};

export default function ContactIndexBlock({ contactId }: Props) {
  const localizedAppState = window.moment
    ? { ...GlobalState.instance.appState, id: makeid(3), locale: (window.moment as any).locale() }
    : { ...GlobalState.instance.appState, id: makeid(3) };

  const [appState, appDispatch] = useReducer(AppReducer, localizedAppState);
  const appProviderState = {
    appState,
    appDispatch,
  };
  const { t } = useTranslation();

  const [sharedNotesState, sharedNotesDispatch] = useReducer(NotesReducer, initialNotesState);
  const sharedNotesProviderState = {
    notesState: sharedNotesState,
    notesDispatch: sharedNotesDispatch,
  };

  const [sharingNotesState, sharingNotesDispatch] = useReducer(NotesReducer, initialNotesState);
  const sharingNotesProviderState = {
    notesState: sharingNotesState,
    notesDispatch: sharingNotesDispatch,
  };

  async function fetchContactNotes() {
    const people = await PeoplesService.instance.getPeople(contactId, true);
    if (people) {
      sharedNotesDispatch({ type: NotesActionKind.ResetNotes, payload: people.sharedNotes || [] });
      sharingNotesDispatch({ type: NotesActionKind.ResetNotes, payload: people.sharingNotes || [] });
    }
  }

  useEffect(() => {
    // const listListenerId = makeid(5);
    // const eventsWatcher = EventsWatcherService.instance;

    // eventsWatcher?.watchEvents();
    // eventsWatcher?.addEventListener(listListenerId, new SekundEventListener(["modifySharingPeoples", "note.delete"], reloadList));
    // return () => {
    //   eventsWatcher?.removeEventListener(listListenerId);
    // };
    fetchContactNotes();
  }, []);

  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchContactNotes();
    }
  }, [appState.generalState]);

  function noteClicked(note: Note) {
    touch(appDispatch, note);
    NoteSyncService.instance.syncDown(note._id, note.userId.toString());
  }

  type NoteSummariesProps = {
    providerState: { notesState: NotesState; notesDispatch: React.Dispatch<NotesAction> };
    noNotesMessage: string;
    noNotesDescMessage: string;
  };

  function NoteSummaries({ providerState, noNotesMessage, noNotesDescMessage }: NoteSummariesProps) {
    const { notes } = providerState.notesState;
    if (notes && notes.length > 0) {
      return (
        <NotesContext.Provider value={providerState}>
          <NoteSummariesPanel context="groups" handleNoteClicked={noteClicked} />
        </NotesContext.Provider>
      );
    } else {
      return (
        <div className={`w-full flex flex-col items-center justify-center h-full p-8`}>
          <div className="flex justify-center mb-2">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div className="text-center ">{noNotesMessage}</div>
          <div className="mt-2 text-sm text-center ">{noNotesDescMessage}</div>
        </div>
      );
    }
  }

  return (
    <AppContext.Provider value={appProviderState}>
      <div className="sekund content">
        <h2>Incoming</h2>
        <NoteSummaries providerState={sharedNotesProviderState} noNotesMessage={""} noNotesDescMessage={""}></NoteSummaries>
        <h2>Outgoing</h2>
        <NoteSummaries providerState={sharingNotesProviderState} noNotesMessage={""} noNotesDescMessage={""}></NoteSummaries>
      </div>
    </AppContext.Provider>
  );
}
