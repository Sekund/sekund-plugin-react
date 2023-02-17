import { NoteComment } from "@/domain/NoteComment";
import { peopleAvatar } from "@/helpers/avatars";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import CommentContext, { useCommentContext } from "@/state/CommentContext";
import CommentReducer, { CommentActionKind, initialCommentState } from "@/state/CommentReducer";
import CommentComponent from "@/ui/note/CommentComponent";
import { Popover } from "@headlessui/react";
import { DotsHorizontalIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { ChatIcon } from "@heroicons/react/solid";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";

type Props = {
  comment: NoteComment;
  removeLocalComment: (noteComment: NoteComment) => void;
  editLocalComment: (noteComment: NoteComment) => void;
};

export default function NoteCommentComponent({ comment, removeLocalComment, editLocalComment }: Props) {
  const { t, i18n } = useTranslation(["common", "plugin"]);
  const { appState } = useAppContext();
  const { userProfile, remoteNote } = appState;

  const [editMode, setEditMode] = useState(false);
  const [userComment, setUserComment] = useState<string | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const [commentState, commentDispatch] = useReducer(CommentReducer, initialCommentState);
  const commentProviderState = {
    commentState,
    commentDispatch,
  };

  const guestId = userProfile?._id;
  const popoverButtonRef = useRef<any>();

  useEffect(() => {
    commentDispatch({ type: CommentActionKind.SetCommentText, payload: { text: comment.text, commit: false } });
  }, []);

  useEffect(() => {
    if (commentState.commentText.commit) {
      setUserComment(commentState.commentText.text);
      setTimeout(async () => {
        if (remoteNote) {
          editLocalComment({ ...comment, text: commentState.commentText.text });
          await NotesService.instance.editComment(remoteNote._id, commentState.commentText.text, comment.created, comment.updated);
          setUserComment(null);
        }
      }, 20);
    }
  }, [commentState.commentText]);

  function deleteComment(created: number, updated: number) {
    if (remoteNote) {
      NotesService.instance.removeComment(remoteNote._id, created, updated);
    }
    removeLocalComment(comment);
  }

  function clickPopover() {
    popoverButtonRef?.current?.click();
  }

  function commentActions(noteComment: NoteComment) {
    if (!guestId) {
      return null;
    }
    if ((noteComment.author && noteComment.author._id && noteComment.author._id.equals(guestId)) || noteComment.isWeb) {
      return (
        <div className="flex space-x-2">
          <a
            onClick={() => {
              deleteComment(noteComment.created, noteComment.updated);
              clickPopover();
            }}
            className="flex items-center px-1 py-1 space-x-2 rounded-lg"
          >
            <TrashIcon className="w-5 h-5" />
            <span>{t("Delete")}</span>
          </a>
          {noteComment.isWeb ? null : (
            <a
              onClick={() => {
                setEditMode(true);
                clickPopover();
              }}
              className="flex items-center px-1 py-1 space-x-2 rounded-lg"
            >
              <PencilIcon className="w-5 h-5" />
              <span>{t("Edit")}</span>
            </a>
          )}
        </div>
      );
    }
  }

  const { preview } = commentState;

  return (
    <div key={comment.created} className="flex items-start">
      {comment.isWeb ? (
        <div className="flex-shrink-0 text-obs-muted">
          <ChatIcon className="w-8 h-8" />
        </div>
      ) : (
        <div className="flex-shrink-0">{peopleAvatar(comment.author, 8)}</div>
      )}
      <div
        ref={area}
        className={`flex flex-col px-3 pt-2 text-sm rounded-lg text-primary bg-secondary whitespace-pre-wrap ${editMode ? "w-full" : ""}`}
      >
        <div className="flex justify-between">
          <div className="flex items-center mb-2 space-x-2 ">
            <ReactTimeAgo className="text-obs-muted" date={+comment.created} locale={i18n.language} />
            {commentActions(comment)}
          </div>
          {editMode ? (
            <a
              className={`mr-0 ${comment.text === "" ? "text-obs-faint" : "text-obs-normal"}`}
              onClick={() => commentDispatch({ type: CommentActionKind.SetPreview, payload: !preview })}
            >
              {preview ? t("edit") : t("preview")}
            </a>
          ) : null}
        </div>

        <CommentContext.Provider value={commentProviderState}>
          <CommentComponent
            editMode={editMode}
            setEditMode={setEditMode}
            commentId={`skn-comment-${comment.updated}`}
            webComment={comment.isWeb ? comment : undefined}
          />
        </CommentContext.Provider>
      </div>
    </div>
  );
}
