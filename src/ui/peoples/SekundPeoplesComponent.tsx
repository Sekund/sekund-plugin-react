import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import PeoplesReducer, { initialPeoplesState, PeoplesActionKind } from "@/state/PeoplesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import SekundPeopleSummary from "@/ui/peoples/SekundPeopleSummary";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid } from "@/utils";
import { EmojiSadIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useReducer } from "react";
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
  const notesProviderState = {
    notesState,
    notesDispatch,
  };

  const { peoples } = peoplesState;
  let mode: 'sharing' | 'shared' | 'none' = 'none';
  let focusedPerson: ObjectID | undefined = undefined;

  async function fetchPeoples() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }
    const peoples = await peoplesService.getPeoples();
    peoplesDispatch({ type: PeoplesActionKind.SetPeoples, payload: peoples });
  }

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher.watchEvents();
    eventsWatcher.addEventListener(listenerId, new SekundEventListener(["modifySharingPeoples"], reloadList))
    return () => {
      eventsWatcher.removeEventListener(listenerId);
    }
  }, [])

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
    mode = 'sharing';
    focusedPerson = peopleId;
    const sharingNotes = await NotesService.instance.getSharingNotes(peopleId.toString());
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: sharingNotes })
  }

  async function displayShared(peopleId: ObjectID) {
    mode = 'shared';
    focusedPerson = peopleId;
    const sharedNotes = await NotesService.instance.getSharedNotes(peopleId.toString());
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: sharedNotes })
  }

  function noteClicked(note: Note) {
    console.log("note clicked");
    syncDown(note.path, note.userId.toString());
  }

  if (peoples && peoples.length > 0) {
    return (
      <NotesContext.Provider value={notesProviderState}>
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
        <NoteSummariesPanel handleNoteClicked={noteClicked} />
      </NotesContext.Provider>)
  } else return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-8">
      <div className="flex justify-center mb-2"><EmojiSadIcon className="w-6 h-6" /></div>
      <div className="text-center ">{t('plugin:noOne')}</div>
      <div className="mt-2 text-sm text-center ">{t('plugin:noOneDesc')}</div>
    </div>)
}

export default (props: PeoplesComponentProps) => withConnectionStatus(props)(SekundPeoplesComponent)