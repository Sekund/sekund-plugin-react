import { Note } from "@/domain/Note";
import { PeopleId } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import NotesService from "@/services/NotesService";
import UsersService from "@/services/UsersService";
import { useAppContext } from "@/state/AppContext";
import { useNotesContext } from "@/state/NotesContext";
import { NotesActionKind } from "@/state/NotesReducer";
import { ViewType } from "@/ui/main/SekundMainComponent";
import { originalPath } from "@/utils";
import { ChatAlt2Icon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";

type Props = {
  noteSummary: Note;
  context: ViewType;
  handleNoteClicked: (note: Note) => void;
};

export default function NoteSummaryComponent({ noteSummary, handleNoteClicked, context }: Props) {
  const { t, i18n } = useTranslation();
  const { appState } = useAppContext();

  const { notesDispatch } = useNotesContext();

  const { remoteNote, currentFile } = appState;
  const { unreadNotes } = appState;
  const [note, setNote] = useState(noteSummary);

  useEffect(() => {
    for (const unreadNote of unreadNotes.all) {
      if (unreadNote._id.equals(note._id)) {
        setNote({
          ...note,
          updated: unreadNote.updated,
          comments: unreadNote.comments,
          path: unreadNote.path,
          title: unreadNote.title,
        });
      }
    }
  }, [unreadNotes]);

  function readStatusClass() {
    if (note && currentFile) {
      if (currentFile && note.path === originalPath(currentFile)) {
        // console.log("we are looking at the updated file")
        return "";
      }
      if (note.isRead < note.updated) {
        return "font-bold";
      }
    }
    return "";
  }

  function isCurrentNote() {
    return note._id.equals(remoteNote?._id || new ObjectID());
  }

  async function noteClicked() {
    if (NotesService.instance) {
      await NotesService.instance.setNoteIsRead(note._id);
    }
    notesDispatch({ type: NotesActionKind.SetNoteIsRead, payload: note._id });
    handleNoteClicked(note);
    setNote({ ...note, isRead: Date.now() });
  }

  function summaryContents() {
    return (
      <>
        <div className={`${readStatusClass()}`}>{note.title.replace(".md", "")}</div>
        <div className="flex items-center justify-between">
          <ReactTimeAgo className="text-obs-muted" date={+note.created} locale={i18n.language} />
          {note.comments && note.comments.length > 0 ? (
            <div key="cmts" className="flex items-center">
              <ChatAlt2Icon className="w-4 h-4" />
              {note.comments.length}
            </div>
          ) : null}
        </div>
      </>
    );
  }
  function summary() {
    return (
      <div
        className={`flex flex-col px-3 py-2 text-sm transition cursor-pointer bg-obs-primary-alt hover:bg-obs-tertiary ${
          isCurrentNote() ? "bg-obs-tertiary" : ""
        }`}
        onClick={noteClicked}
      >
        {summaryContents()}
      </div>
    );
  }

  function withAvatar(summary: JSX.Element) {
    const author: PeopleId | undefined = UsersService.instance.getUserInfo(note.userId.toString());
    if (author) {
      return (
        <div
          className={`flex space-x-2 items-center px-3 py-2 text-sm transition cursor-pointer bg-obs-primary-alt hover:bg-obs-tertiary ${
            isCurrentNote() ? "bg-obs-tertiary" : ""
          }`}
          onClick={noteClicked}
        >
          <div className="flex-shrink-0">{peopleAvatar(author, 8)}</div>
          <div className="flex flex-col flex-grow">{summaryContents()}</div>
        </div>
      );
    }
    return summary;
  }

  if (context === "groups" || context === "peoples") {
    return withAvatar(summary());
  }
  return summary();
}
