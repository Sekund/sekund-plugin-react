import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import NoteSyncService from "@/services/NoteSyncService";
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
  groupId: string;
};

export default function GroupIndexBlock({ groupId }: Props) {
  const localizedAppState = window.moment
    ? { ...GlobalState.instance.appState, id: makeid(3), locale: (window.moment as any).locale() }
    : { ...GlobalState.instance.appState, id: makeid(3) };

  const [appState, appDispatch] = useReducer(AppReducer, localizedAppState);
  const appProviderState = {
    appState,
    appDispatch,
  };
  const { t } = useTranslation();

  const [groupNotesState, groupNotesDispatch] = useReducer(NotesReducer, initialNotesState);
  const groupNotesProviderState = {
    notesState: groupNotesState,
    notesDispatch: groupNotesDispatch,
  };

  async function fetchGroupNotes() {
    const notes: Note[] = await NotesService.instance.getGroupNotes(groupId);
    if (notes && notes.length > 0) {
      groupNotesDispatch({ type: NotesActionKind.ResetNotes, payload: notes });
    }
  }

  useEffect(() => {
    fetchGroupNotes();
  }, []);

  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchGroupNotes();
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
        <NoteSummaries providerState={groupNotesProviderState} noNotesMessage={""} noNotesDescMessage={""}></NoteSummaries>
      </div>
    </AppContext.Provider>
  );
}
