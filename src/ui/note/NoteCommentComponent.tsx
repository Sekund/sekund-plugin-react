import { NoteComment } from "@/domain/NoteComment";
import { getAvatar } from "@/helpers/avatars";
import { isVisible } from "@/helpers/visibility";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { Popover } from "@headlessui/react";
import { DotsHorizontalIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  comment: NoteComment;
};

export default function NoteCommentComponent({ comment }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const { appState } = useAppContext();
  const { userProfile, remoteNote } = appState;

  const [editMode, setEditMode] = useState(false);
  // const { notesState } = useNotesContext();
  const [userComment, setUserComment] = useState<string | null>(null);
  const area = useRef<HTMLDivElement>(null);

  const guestId = userProfile?._id;

  useEffect(() => {
    if (!editMode && userComment) {
      setTimeout(async () => {
        if (remoteNote) {
          await NotesService.instance.editComment(remoteNote._id, userComment, comment.created, comment.updated);
          // comment.text = userComment;
          setUserComment(null);
        }
      }, 20);
    }
  }, [editMode]);

  function deleteComment(created: number, updated: number) {
    if (remoteNote) {
      NotesService.instance.removeComment(remoteNote._id, created, updated);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      ensureAreaBottomVisible();
      if (!e.shiftKey) {
        setEditMode(false);
      }
    }
    if (e.code === "Escape") {
      setUserComment(comment.text);
      setEditMode(false);
    }
  }

  function ensureAreaBottomVisible() {
    if (area.current) {
      const inView = isVisible(area.current);
      if (!inView) {
        let position = area.current.getBoundingClientRect();
        window.scrollTo(position.left, position.bottom + window.scrollY + 100);
      }
    }
  }

  function commentText() {
    if (editMode) {
      return <TextareaAutosize minRows={2} onHeightChange={ensureAreaBottomVisible} onKeyDown={(e: any) => handleKeydown(e)} onChange={(evt) => setUserComment(evt.target.value)} className="p-1 text-gray-800 input" defaultValue={comment.text}></TextareaAutosize>;
    }
    return comment.text;
  }

  function commentActions(noteComment: NoteComment) {
    if (!guestId) { return null }
    if (noteComment.author && noteComment.author._id && noteComment.author._id.equals(guestId)) {
      return (
        <Popover className="flex items-center flex-shrink-0 ">
          <Popover.Button className="relative p-1 rounded-full cursor-pointer hover:bg-primary">
            <DotsHorizontalIcon className="w-6 h-6"></DotsHorizontalIcon>
          </Popover.Button>

          <Popover.Panel className="absolute z-30 mt-24 rounded-lg cursor-pointer bg-obs-primary-alt">
            <div className="flex flex-col px-2 py-2 space-y-2 text-sm rounded-lg leading-2 text-primary bg-obs-primary-alt">
              <a onClick={() => deleteComment(noteComment.created, noteComment.updated)} className="flex items-center px-1 py-1 space-x-2 rounded-lg hover:bg-gray-200 hover:text-gray-700">
                <TrashIcon className="w-5 h-5" />
                <span>{t('Delete')}</span>
              </a>
              <a onClick={() => setEditMode(true)} className="flex items-center px-1 py-1 space-x-2 rounded-lg hover:bg-gray-200 hover:text-gray-700">
                <PencilIcon className="w-5 h-5" />
                <span>{t('Edit')}</span>
              </a>
            </div>
          </Popover.Panel>
        </Popover>
      );
    }
  }


  const { image, name, email } = comment.author;

  return (
    <div key={comment.created} className="flex">
      <div className="flex-shrink-0">{getAvatar(name, image, email, 8)}</div>
      <div ref={area} className={`flex flex-col px-3 pt-3 pb-2 text-sm rounded-lg text-primary bg-secondary whitespace-pre-wrap ${editMode ? "w-full" : ""}`}>
        {commentText()}
        {editMode ? (
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
      {commentActions(comment)}
    </div>
  );
}
