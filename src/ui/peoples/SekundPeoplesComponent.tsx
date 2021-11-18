import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import GlobalState from "@/state/GlobalState";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import PeoplesReducer, { initialPeoplesState, PeoplesActionKind } from "@/state/PeoplesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import SekundPeopleSummary from "@/ui/peoples/SekundPeopleSummary";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid } from "@/utils";
import { EmojiSadIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

export type PeoplesComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  syncDown: (path: string, userId: string) => void,
}

export const SekundPeoplesComponent = ({ peoplesService, syncDown }: PeoplesComponentProps) => {
  const { appState } = useAppContext();
  const { t } = useTranslation("plugin");
  const [peoplesState, peoplesDispatch] = useReducer(PeoplesReducer, initialPeoplesState);
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const [mode, setMode] = useState<'sharing' | 'shared' | 'none'>('none')
  const [focusedPerson, setFocusedPerson] = useState<ObjectID | undefined>()
  const notesProviderState = {
    notesState,
    notesDispatch,
  };

  const { peoples } = peoplesState;

  async function fetchPeoples() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }
    const peoples = await peoplesService.getPeoples();
    peoplesDispatch({ type: PeoplesActionKind.SetPeoples, payload: peoples });
  }

  useEffect(() => {
    const listListenerId = makeid(5);
    const commentsListenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;

    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(listListenerId, new SekundEventListener(["modifySharingPeoples"], reloadList))
    eventsWatcher?.addEventListener(commentsListenerId, new SekundEventListener(["note.addComment",
      "note.removeComment", "note.editComment"], checkComments))
    return () => {
      eventsWatcher?.removeEventListener(listListenerId);
      eventsWatcher?.removeEventListener(commentsListenerId);
    }
  }, [])

  function checkComments(fullDocument: any) {
    const updtNote: Note = fullDocument.data;
    if (GlobalState.instance.appState.remoteNote && updtNote._id.equals(GlobalState.instance.appState.remoteNote._id)) {
      // automatically set updates to read when they pertain to the
      // currently displayed note
      NotesService.instance.setNoteIsRead(updtNote._id);
      notesDispatch({ type: NotesActionKind.UpdateNote, payload: { ...updtNote, isRead: Date.now() } })
    } else {
      notesDispatch({ type: NotesActionKind.UpdateNote, payload: updtNote })
    }
  }

  function reloadList() {
    console.log("reloading list as there were changes");
    fetchPeoples();
    if (focusedPerson && notesState.notes && notesState.notes.length > 0) {
      switch (mode) {
        case 'shared':
          displayShared(focusedPerson);
          break;
        case 'sharing':
          displaySharing(focusedPerson);
          break;
      }
    }
  }

  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchPeoples();
    }
  }, [appState.generalState])

  async function displaySharing(peopleId: ObjectID) {
    setMode('sharing');
    setFocusedPerson(peopleId);
    const sharingNotes = await NotesService.instance.getSharingNotes(peopleId.toString());
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: sharingNotes })
  }

  async function displayShared(peopleId: ObjectID) {
    setMode('shared');
    setFocusedPerson(peopleId);
    const sharedNotes = await NotesService.instance.getSharedNotes(peopleId.toString());
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: sharedNotes })
  }

  function noteClicked(note: Note) {
    syncDown(note.path, note.userId.toString());
  }

  if (peoples && peoples.length > 0) {
    return (
      <NotesContext.Provider value={notesProviderState}>
        {notesState.notes && notesState.notes.length > 0 ?
          <NoteSummariesPanel handleNoteClicked={noteClicked} />
          :
          <div className="flex flex-col divide-y divide-solid divide-obs-modifier-border w-xl" >
            {peoples.map((people: People) => {
              return (
                <SekundPeopleSummary key={people._id.toString()}
                  people={people}
                  displayShared={displayShared}
                  displaySharing={displaySharing} />
              );
            })}
          </div>
        }
      </NotesContext.Provider>)
  } else return (
    <div className="flex flex-col items-center justify-center h-full p-8 ">
      <div className="flex justify-center mb-2"><EmojiSadIcon className="w-6 h-6" /></div>
      <div className="text-center ">{t('plugin:noOne')}</div>
      <div className="mt-2 text-sm text-center ">{t('plugin:noOneDesc')}</div>
    </div>)
}

export default (props: PeoplesComponentProps) => withConnectionStatus(props)(SekundPeoplesComponent)