import { Note } from "@/domain/Note";
import { NoteComment } from "@/domain/NoteComment";
import { peopleAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { AppActionKind } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import CommentComponent from "@/ui/note/CommentComponent";
import NoteCommentComponent from "@/ui/note/NoteCommentComponent";
import { dispatch, makeid } from "@/utils";
import React, { Fragment, useEffect, useReducer, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CommentContext from "@/state/CommentContext";
import CommentReducer, { CommentActionKind, initialCommentState } from "@/state/CommentReducer";
import { UpdateKey } from "@/state/NotificationsReducer";

type Props = {
  note: Note;
  className: string;
};

export default function NoteComments({ note, className }: Props) {
  const { appState, appDispatch } = useAppContext();
  const { t } = useTranslation(["common", "plugin"]);
  const { userProfile, plugin, remoteNote } = appState;

  const sendButton = useRef<HTMLButtonElement>(null);
  const [commentState, commentDispatch] = useReducer(CommentReducer, initialCommentState);
  const commentProviderState = {
    commentState,
    commentDispatch,
  };

  const [localComments, setLocalComments] = useState<Array<NoteComment>>(remoteNote?.comments || []);

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(
      listenerId,
      new SekundEventListener([UpdateKey.NOTE_ADD_COMMENT, UpdateKey.NOTE_REMOVE_COMMENT, UpdateKey.NOTE_EDIT_COMMENT], reloadNote)
    );
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
      const now = Date.now();
      NotesService.instance.addNoteComment(appState.remoteNote._id, commentState.commentText.text, plugin?.user.customData._id as string, now);
      const updtLocalComments = [
        ...localComments,
        {
          text: commentState.commentText.text,
          author: userProfile,
          authorEmail: userProfile.email || "",
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
        const textarea = document.getElementById("sekund-comment") as HTMLTextAreaElement;
        textarea.value = "";
        textarea.style.height = "initial";
        commentDispatch({ type: CommentActionKind.SetCommentText, payload: { text: "", commit: false } });
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
    commentDispatch({ type: CommentActionKind.SetCommentText, payload: { text: "", commit: false } });
    if (textarea.parentNode) {
      (textarea.parentNode as HTMLElement).dataset.replicatedValue = "";
    }
    textarea.value = "";
  }

  useEffect(() => {
    if (commentState.commentText.commit) {
      addComment();
    }
  }, [commentState.commentText]);

  const { preview, commentText } = commentState;

  return (
    <div className={`w-full px-2 mt-1 mb-16 ${className}`}>
      <div className="sm:col-span-2">
        <div className="flex items-center justify-between">
          <label htmlFor="message" className="flex items-center h-10 space-x-2 text-obs-muted">
            <span>{peopleAvatar(userProfile, 8)}</span> <span>{t("you")}</span>
          </label>
          <a
            className={`mr-0 ${commentText.text === "" ? "text-obs-faint" : "text-obs-normal"}`}
            onClick={() => commentDispatch({ type: CommentActionKind.SetPreview, payload: !preview })}
          >
            {preview ? t("edit") : t("preview")}
          </a>
        </div>
        <CommentContext.Provider value={commentProviderState}>
          <CommentComponent editMode={true} setEditMode={(b) => {}} commentId="sekund-comment" />
        </CommentContext.Provider>
      </div>
      <div className="relative flex items-center flex-end">
        {preview ? null : (
          <>
            <div className="flex justify-end w-full mt-2">
              <button
                className={`mr-2 ${commentText.text === "" ? "text-obs-faint" : "text-obs-normal"}`}
                onClick={commentText.text === "" ? undefined : clearComment}
                type="button"
              >
                {t("clear")}
              </button>
              <button
                className={`mr-0 ${commentText.text === "" ? "text-obs-faint" : "text-obs-normal mod-cta"}`}
                ref={sendButton}
                onClick={commentText.text === "" ? undefined : addComment}
                type="button"
              >
                {t("send")}
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col mt-4 space-y-4">
        {localComments
          ?.sort((a, b) => (a.created > b.created ? -1 : 1))
          .map((noteComment) => {
            return (
              <Fragment key={noteComment.updated}>
                <NoteCommentComponent comment={noteComment} removeLocalComment={removeLocalComment} editLocalComment={editLocalComment} />
              </Fragment>
            );
          })}
      </div>
    </div>
  );
}
