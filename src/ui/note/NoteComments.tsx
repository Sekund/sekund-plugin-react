import { NoteComment } from "@/domain/NoteComment";
import { getAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { AppActionKind } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import NoteCommentComponent from "@/ui/note/NoteCommentComponent";
import { dispatch, makeid } from "@/utils";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function NoteComments() {
  const { appState } = useAppContext();
  const { t } = useTranslation(["common", "plugin"]);
  const { userProfile, plugin, remoteNote } = appState;

  const guestImage = userProfile?.image;
  const guestName = userProfile?.name;
  const guestEmail = userProfile?.email;
  const sendButton = useRef<HTMLButtonElement>(null);
  const [areaText, setAreaText] = useState("");

  const [localComments, setLocalComments] = useState<Array<NoteComment>>(remoteNote?.comments || [])

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher.watchEvents();
    eventsWatcher.addEventListener(listenerId, new SekundEventListener(["addComment", "removeComment", "editComment"], reloadNote))
    return () => {
      eventsWatcher.removeEventListener(listenerId);
    }
  }, [])

  function reloadNote(evt: any) {
    (async () => {
      const currentRemoteNote = GlobalState.instance.appState.remoteNote;
      if (currentRemoteNote && evt.data.noteId.equals(currentRemoteNote._id)) {
        if (evt.updateTime > currentRemoteNote.updated) {
          const updtNote = await NotesService.instance.getNote(currentRemoteNote._id.toString())
          if (appState.plugin) {
            dispatch(appState.plugin.dispatchers, AppActionKind.SetCurrentNoteState, {
              noteState: undefined,
              note: updtNote,
              file: undefined
            })
          }
          if (updtNote) {
            setLocalComments(updtNote.comments);
          }
        }
      }
    })()
  }

  useEffect(() => {
    setLocalComments(remoteNote?.comments || []);
  }, [appState.remoteNote]);

  async function addComment() {
    if (appState.remoteNote) {
      const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
      NotesService.instance.addNoteComment(appState.remoteNote._id, textarea.value, plugin?.user.customData._id);
      textarea.value = "";
    }
  }

  function clearComment() {
    const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
    setAreaText((textarea.value = ""));
  }

  function autoexpand() {
    const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
    if (textarea.parentNode) {
      (textarea.parentNode as HTMLElement).dataset.replicatedValue = textarea.value
    }
  }

  return (
    <div className="px-2 mt-1 mb-16">
      <div className={`sm:col-span-2`}>
        <label htmlFor="message" className="flex items-center h-10 space-x-2">
          <span>{getAvatar(guestName, guestImage, guestEmail, 8)}</span> <span>{t('you')}</span>
        </label>
        <div className="mt-1 grow-wrap">
          <textarea onInput={autoexpand} onChange={(e) => setAreaText(e.target.value)} id="sekund-comment" name="message" rows={2} className="relative block w-full px-2 py-1 text-sm border rounded-md" aria-describedby="message-max" defaultValue={""} />
        </div>
      </div>
      <div className="flex justify-end w-full mt-2">
        <button className={`${areaText === '' ? 'text-obs-faint' : 'text-obs-normal'}`} onClick={areaText === '' ? undefined : clearComment} type="button">
          {t('clear')}
        </button>
        <button className={`${areaText === '' ? 'text-obs-faint' : 'text-obs-normal mod-cta'}`} ref={sendButton} onClick={areaText === '' ? undefined : addComment} type="button">
          {t('send')}
        </button>
      </div>
      <div className="flex flex-col mt-4 space-y-4">
        {localComments?.sort((a, b) => (a.created > b.created) ? -1 : 1).map((noteComment) => {
          return (
            <Fragment key={noteComment.created}>
              <NoteCommentComponent comment={noteComment}></NoteCommentComponent>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
