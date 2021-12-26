import { Note } from "@/domain/Note";
import { NoteComment } from "@/domain/NoteComment";
import { peopleAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { AppActionKind } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import NoteCommentComponent from "@/ui/note/NoteCommentComponent";
import { dispatch, makeid } from "@/utils";
import Markdown from "markdown-to-jsx";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  note: Note;
};

export default function NoteComments({ note }: Props) {
  const { appState, appDispatch } = useAppContext();
  const { t } = useTranslation(["common", "plugin"]);
  const { userProfile, plugin, remoteNote } = appState;

  const [preview, setPreview] = useState(false);

  const sendButton = useRef<HTMLButtonElement>(null);
  const [areaText, setAreaText] = useState("");

  const [localComments, setLocalComments] = useState<Array<NoteComment>>(remoteNote?.comments || []);

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(listenerId, new SekundEventListener(["note.addComment", "note.removeComment", "note.editComment"], reloadNote));
    return () => {
      eventsWatcher?.removeEventListener(listenerId);
    };
  }, []);

  function reloadNote(evt: any) {
    (async () => {
      const currentRemoteNote = GlobalState.instance.appState.remoteNote;
      if (currentRemoteNote && evt.data._id.equals(currentRemoteNote._id)) {
        if (evt.updateTime > currentRemoteNote.updated) {
          const updtNote = await NotesService.instance.getNote(currentRemoteNote._id.toString());
          if (appState.plugin) {
            dispatch(appState.plugin.dispatchers, AppActionKind.SetCurrentNoteState, {
              noteState: undefined,
              note: updtNote,
              file: undefined,
            });
          }
          if (updtNote) {
            setLocalComments(updtNote.comments);
          }
        }
      }
    })();
  }

  useEffect(() => {
    setLocalComments(remoteNote?.comments || []);
  }, [appState.remoteNote]);

  async function addComment() {
    if (appState.remoteNote) {
      const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
      if (textarea.value.trim() === "") {
        return;
      }
      const now = Date.now();
      NotesService.instance.addNoteComment(appState.remoteNote._id, textarea.value, plugin?.user.customData._id as string, now);
      const updtLocalComments = [
        ...localComments,
        {
          text: textarea.value,
          author: userProfile,
          created: now,
          updated: now,
        },
      ];
      setLocalComments(updtLocalComments);
      appDispatch({
        type: AppActionKind.SetNoteUpdates,
        payload: {
          _id: note._id,
          title: note.title,
          path: note.path,
          comments: updtLocalComments,
          isRead: now + 1,
          updated: now,
        },
      });
      setTimeout(() => {
        textarea.value = "";
        textarea.style.height = "initial";
        if (textarea.parentNode) {
          (textarea.parentNode as HTMLElement).dataset.replicatedValue = "";
        }
        textarea.focus();
        textarea.setSelectionRange(0, 0);
      }, 10);
    }
  }
  function removeLocalComment(noteComment: NoteComment) {
    const comments = localComments.filter((c) => c.created !== noteComment.created && c.updated !== noteComment.updated);
    const now = Date.now();
    appDispatch({
      type: AppActionKind.SetNoteUpdates,
      payload: {
        comments: comments,
        isRead: now,
      },
    });
    setLocalComments(comments);
  }

  function editLocalComment(noteComment: NoteComment) {
    const comments = localComments.map((c) => (c.created === noteComment.created && c.updated === noteComment.updated ? noteComment : c));
    setLocalComments(comments);
  }

  function clearComment() {
    const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
    setAreaText((textarea.value = ""));
  }

  function autoexpand() {
    const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
    if (textarea.parentNode) {
      (textarea.parentNode as HTMLElement).dataset.replicatedValue = textarea.value;
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (!e.shiftKey && e.code === "Enter") {
      addComment();
    }
  }

  function togglePreview() {
    if (preview) {
      setPreview(!preview);
      setTimeout(() => {
        const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
        if (textarea.parentNode) {
          (textarea.parentNode as HTMLElement).dataset.replicatedValue = areaText;
          textarea.value = areaText;
        }
      }, 10);
    } else {
      const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
      if (textarea.parentNode) {
        setAreaText(textarea.value);
        (textarea.parentNode as HTMLElement).dataset.replicatedValue = "";
      }
      setPreview(!preview);
    }
  }

  return (
    <div className="px-2 mt-1 mb-16">
      <div className={`sm:col-span-2`}>
        <div className="flex items-center justify-between">
          <label htmlFor="message" className="flex items-center h-10 space-x-2 text-obs-muted">
            <span>{peopleAvatar(userProfile, 8)}</span> <span>{t("you")}</span>
          </label>
          <button className={`mr-0 ${areaText === "" ? "text-obs-faint" : "text-obs-normal"}`} onClick={togglePreview}>
            {preview ? t("edit") : t("preview")}
          </button>
        </div>
        {preview ? (
          <div className="mt-1 px-2 pt-2">
            <Markdown>{areaText}</Markdown>
          </div>
        ) : (
          <div className="mt-1 grow-wrap">
            <textarea
              onInput={autoexpand}
              onChange={(e) => setAreaText(e.target.value)}
              onKeyPress={handleKeyPress}
              id="sekund-comment"
              name="message"
              rows={2}
              spellCheck="false"
              className="relative block w-full px-2 py-1 text-sm border rounded-md"
              aria-describedby="message-max"
              defaultValue={""}
            />
          </div>
        )}
      </div>
      {preview ? null : (
        <div className="flex justify-end w-full mt-2">
          <button
            className={`mr-2 ${areaText === "" ? "text-obs-faint" : "text-obs-normal"}`}
            onClick={areaText === "" ? undefined : clearComment}
            type="button"
          >
            {t("clear")}
          </button>
          <button
            className={`mr-0 ${areaText === "" ? "text-obs-faint" : "text-obs-normal mod-cta"}`}
            ref={sendButton}
            onClick={areaText === "" ? undefined : addComment}
            type="button"
          >
            {t("send")}
          </button>
        </div>
      )}
      <div className="flex flex-col mt-4 space-y-4">
        {localComments
          ?.sort((a, b) => (a.created > b.created ? -1 : 1))
          .map((noteComment) => {
            return (
              <Fragment key={noteComment.created}>
                <NoteCommentComponent comment={noteComment} removeLocalComment={removeLocalComment} editLocalComment={editLocalComment} />
              </Fragment>
            );
          })}
      </div>
    </div>
  );
}
