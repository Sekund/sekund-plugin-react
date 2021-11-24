import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import PeoplesReducer, { initialPeoplesState, PeoplesActionKind } from "@/state/PeoplesReducer";
import SekundPeopleSummary from "@/ui/peoples/SekundPeopleSummary";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid, touch } from "@/utils";
import { EmojiSadIcon } from "@heroicons/react/solid";
import React, { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

export type PeoplesComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  syncDown: (path: string, userId: string) => void,
} & React.HTMLAttributes<HTMLDivElement>;

export const SekundPeoplesComponent = ({ className, peoplesService, syncDown }: PeoplesComponentProps) => {
  const { appState, appDispatch } = useAppContext();
  const { t } = useTranslation("plugin");
  const [peoplesState, peoplesDispatch] = useReducer(PeoplesReducer, initialPeoplesState);

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
    eventsWatcher?.addEventListener(commentsListenerId, new SekundEventListener(["note.addComment"], checkComments))
    return () => {
      eventsWatcher?.removeEventListener(listListenerId);
      eventsWatcher?.removeEventListener(commentsListenerId);
    }
  }, [])

  function checkComments(fullDocument: any) {
  }

  function reloadList() {
    fetchPeoples();
  }

  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchPeoples();
    }
  }, [appState.generalState])

  function noteClicked(note: Note) {
    if (note.isRead && note.isRead < note.updated) {
      fetchPeoples();
    }
    touch(appDispatch, note._id);
    syncDown(note.path, note.userId.toString());
  }

  if (peoples && peoples.length > 0) {
    return (
      <div className={`${className} flex flex-col divide-y divide-solid divide-obs-modifier-border w-xl border-x-none`} >
        {peoples.map((people: People) => {
          return (
            <SekundPeopleSummary key={people._id.toString()}
              people={people} handleNoteClicked={noteClicked} />
          );
        })}
      </div>)
  } else return (
    <div className={`${className} flex flex-col items-center justify-center h-full p-8`}>
      <div className="flex justify-center mb-2"><EmojiSadIcon className="w-6 h-6" /></div>
      <div className="text-center ">{t('plugin:noOne')}</div>
      <div className="mt-2 text-sm text-center ">{t('plugin:noOneDesc')}</div>
    </div>)
}

export default (props: PeoplesComponentProps) => withConnectionStatus(props)(SekundPeoplesComponent)