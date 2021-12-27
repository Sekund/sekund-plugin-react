import { NoteComment } from "@/domain/NoteComment";
import { peopleAvatar } from "@/helpers/avatars";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import CommentComponent from "@/ui/note/CommentComponent";
import { Popover } from "@headlessui/react";
import { DotsHorizontalIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";
import Markdown from "markdown-to-jsx";
import React, { useEffect, useRef, useState } from "react";
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
  const [preview, setPreview] = useState(false);
  const [userComment, setUserComment] = useState<string | null>(null);
  const area = useRef<HTMLDivElement>(null);

  const guestId = userProfile?._id;
  const popoverButtonRef = useRef<any>();

  useEffect(() => {
    if (!editMode && userComment) {
      setTimeout(async () => {
        if (remoteNote) {
          editLocalComment({ ...comment, text: userComment });
          await NotesService.instance.editComment(remoteNote._id, userComment, comment.created, comment.updated);
          setUserComment(null);
        }
      }, 20);
    }
  }, [editMode]);

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
    if (noteComment.author && noteComment.author._id && noteComment.author._id.equals(guestId)) {
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
            </div>
          </Popover.Panel>
        </Popover>
      );
    }
  }

  return (
    <div key={comment.created} className="flex items-start">
      <div className="flex-shrink-0">{peopleAvatar(comment.author, 8)}</div>
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
            <a className={`mr-0 ${comment.text === "" ? "text-obs-faint" : "text-obs-normal"}`} onClick={() => setPreview(!preview)}>
              {preview ? t("edit") : t("preview")}
            </a>
          ) : null}
        </div>

        <CommentComponent
          editMode={editMode}
          setEditMode={setEditMode}
          commentId={`skn-comment-${comment.updated}`}
          commentText={comment.text}
          preview={preview}
          setCommentText={setUserComment}
        />

        {!preview && editMode ? (
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
        ) : null}
      </div>
    </div>
  );
}
