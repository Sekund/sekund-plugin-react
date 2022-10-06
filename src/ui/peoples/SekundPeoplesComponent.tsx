import { Note } from "@/domain/Note";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid, touch } from "@/utils";
import { SparklesIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

export type PeoplesComponentProps = {
  view: { addAppDispatch: Function };
  notesService: NotesService | undefined;
  syncDown: (id: ObjectID, userId: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const SekundPeoplesComponent = ({ className, notesService, syncDown }: PeoplesComponentProps) => {
  const { appState, appDispatch } = useAppContext();
  const { t } = useTranslation();
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };

  const { notes } = notesState;

  async function fetchSharedNotes() {
    if (!notesService) {
      notesService = NotesService.instance;
    }
    const notes = await notesService.getAllSharedNotes();
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: notes });
  }

  useEffect(() => {
    const listListenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;

    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(listListenerId, new SekundEventListener(["modifySharingPeoples", "note.delete"], reloadList));
    return () => {
      eventsWatcher?.removeEventListener(listListenerId);
    };
  }, []);

  async function reloadList() {
    fetchSharedNotes();
  }

  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchSharedNotes();
    }
  }, [appState.generalState]);

  function noteClicked(note: Note) {
    touch(appDispatch, note);
    syncDown(note._id, note.userId.toString());
  }

  if (notes && notes.length > 0) {
    return (
      <div className={className}>
        <NotesContext.Provider value={notesProviderState}>
          <NoteSummariesPanel context="groups" handleNoteClicked={noteClicked} />
        </NotesContext.Provider>
      </div>
    );
  } else
    return (
      <div className={`${className} w-full flex flex-col items-center justify-center h-full p-8`}>
        <div className="flex justify-center mb-2">
          <SparklesIcon className="w-6 h-6" />
        </div>
        <div className="text-center ">{t("noSharedNotes")}</div>
        <div className="mt-2 text-sm text-center ">{t("noSharedNotesDesc")}</div>
      </div>
    );
};

export default (props: PeoplesComponentProps) => withConnectionStatus(props)(SekundPeoplesComponent);
