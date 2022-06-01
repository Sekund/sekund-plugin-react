import { NoteComment } from "@/domain/NoteComment";
import { peopleAvatar } from "@/helpers/avatars";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import CommentContext, { useCommentContext } from "@/state/CommentContext";
import CommentReducer, { CommentActionKind, initialCommentState } from "@/state/CommentReducer";
import CommentComponent from "@/ui/note/CommentComponent";
import { Popover } from "@headlessui/react";
import { DotsHorizontalIcon, EmojiHappyIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { ChatIcon } from "@heroicons/react/solid";
import { Picker } from "emoji-mart";
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
  const [emojis, setEmojis] = useState(false);
  const [commentState, commentDispatch] = useReducer(CommentReducer, initialCommentState);
  const picker = useRef<any>();
  const commentProviderState = {
    commentState,
    commentDispatch,
  };

  const guestId = userProfile?._id;
  const popoverButtonRef = useRef<any>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (picker.current && event.target && !picker.current.contains(event.target as any)) {
        setEmojis(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [picker]);

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

  function insertEmoji(emoji: any) {
    commentDispatch({ type: CommentActionKind.SetEmoji, payload: emoji });
    setEmojis(false);
  }

  function commentActions(noteComment: NoteComment) {
    if (!guestId) {
      return null;
    }
    if ((noteComment.author && noteComment.author._id && noteComment.author._id.equals(guestId)) || noteComment.isWeb) {
      return (
        <Popover className="flex items-center flex-shrink-0 ">
          <Popover.Button
            ref={popoverButtonRef}
            className="flex items-center justify-center w-4 h-4 rounded-full cursor-pointer max-h-4 max-w-4 hover:bg-primary"
          >
            <DotsHorizontalIcon style={{ minWidth: "1rem" }}></DotsHorizontalIcon>
          </Popover.Button>

          <Popover.Panel className="relative rounded-lg cursor-pointer bg-obs-primary-alt">
            <div className="absolute z-30 flex flex-col px-2 py-2 space-y-2 text-sm rounded-lg leading-2 text-primary bg-obs-primary-alt">
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
          </Popover.Panel>
        </Popover>
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

        {!preview && editMode ? (
          <div className="justify-between relative">
            <EmojiHappyIcon className="w-6 h-6 m-1 cursor-pointer text-obs-muted hover:text-obs-normal" onClick={() => setEmojis(true)} />
            <div className="flex items-center justify-end w-full mt-2 text-xs nowrap">
              <span className="nowrap">Press: </span>
              <span className="p-1 truncate rounded-md bg-primary text-primary">␛</span>
              <span className="truncate"> to cancel, </span>
              <span className="p-1 truncate rounded-md bg-primary text-primary">⇧-Enter</span>
              <span className="truncate"> for newline, </span>
              <span className="p-1 truncate rounded-md bg-primary text-primary">Enter</span>
              <span className="truncate"></span>
              <span className="truncate"> to save.</span>
            </div>
            {emojis ? (
              <div className="absolute z-40 top-2" ref={picker}>
                <Picker
                  theme={appState.isDark ? "dark" : "light"}
                  set="apple"
                  perLine={8}
                  emojiSize={20}
                  showPreview={false}
                  color={"#009688"}
                  onSelect={(emoji) => insertEmoji(emoji)}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
