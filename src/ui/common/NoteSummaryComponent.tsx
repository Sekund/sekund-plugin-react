import { Note } from "@/domain/Note";
import { PeopleId } from "@/domain/People";
import { NoteSummary } from "@/domain/Types";
import { peopleAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import UsersService from "@/services/UsersService";
import { useAppContext } from "@/state/AppContext";
import { useNotesContext } from "@/state/NotesContext";
import { NotesActionKind } from "@/state/NotesReducer";
import { ViewType } from "@/ui/main/SekundMainComponent";
import { isUnread, makeid } from "@/utils";
import { ChatAlt2Icon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";

type Props = {
  noteSummary: Note;
  context: ViewType;
  handleNoteClicked: (note: Note) => void;
};

export default function NoteSummaryComponent({ noteSummary, handleNoteClicked, context }: Props) {
  const { i18n } = useTranslation();
  const { appState } = useAppContext();

  const { notesState, notesDispatch } = useNotesContext();

  const { unreadNotes, noteUpdates } = appState;
  const { note: currentNote } = notesState;
  const [isActiveNote, setIsActiveNote] = useState(false);
  const [note, setNote] = useState(noteSummary);

  useEffect(() => {
    let found = false;
    for (const unreadNote of unreadNotes.all) {
      if (unreadNote._id.equals(note._id)) {
        updateNote(unreadNote);
        found = true;
      }
    }
    if (!found && isUnread(note)) {
      // console.log(`set note ${note.title} to read (${context})`);
      setNote({ ...note, isRead: Date.now() });
    }
  }, [unreadNotes]);

  useEffect(() => {
    if (appState.remoteNote) {
      notesDispatch({ type: NotesActionKind.SetNote, payload: appState.remoteNote });
    }
  }, [appState.remoteNote]);

  useEffect(() => {
    if (currentNote?._id.equals(note._id)) {
      setIsActiveNote(true);
    } else setIsActiveNote(false);
  }, [currentNote]);

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(
      listenerId,
      new SekundEventListener(["note.addComment", "note.removeComment", "note.rename"], (fullDocument: any) => {
        const updtNote: Note = fullDocument.data;
        if (note._id.equals(updtNote._id)) {
          updateNote(updtNote);
        }
      })
    );
    return () => {
      eventsWatcher?.removeEventListener(listenerId);
    };
  }, []);

  useEffect(() => {
    if (noteUpdates && noteUpdates._id?.equals(note._id)) {
      updateNote(noteUpdates);
    }
  }, [noteUpdates]);

  function updateNote(updtNote: NoteSummary) {
    setNote({
      ...note,
      updated: updtNote.updated,
      isRead: updtNote.isRead,
      comments: updtNote.comments,
      path: updtNote.path,
      title: updtNote.title,
    });
  }

  function readStatusClass() {
    return isUnread(note) ? "font-bold" : "";
  }

  async function noteClicked() {
    if (NotesService.instance) {
      await NotesService.instance.setNoteIsRead(note._id);
    }
    setIsActiveNote(true);
    notesDispatch({ type: NotesActionKind.SetNote, payload: note });
    notesDispatch({ type: NotesActionKind.SetNoteIsRead, payload: note._id });
    handleNoteClicked(note);
    setNote({ ...note, isRead: Date.now() });
  }

  function summaryContents() {
    return (
      <>
        <div className={`${readStatusClass()}`}>
          {isActiveNote ? "❯" : ""} {note.title.replace(".md", "")}
        </div>
        <div className="flex items-center justify-between">
          <ReactTimeAgo className="text-obs-muted" date={+note.updated} locale={i18n.language} />
          {note.comments && note.comments.length > 0 ? (
            <div key="cmts" className="flex items-center">
              <ChatAlt2Icon className="w-4 h-4 text-obs-normal" />
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
        className={`flex flex-col px-3 py-2 text-sm cursor-pointer hover:bg-obs-secondary ${isActiveNote ? "bg-obs-secondary" : ""}`}
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
          className={`flex space-x-2 items-center px-3 py-2 text-sm cursor-pointer hover:bg-obs-secondary ${isActiveNote ? "bg-obs-secondary" : ""}`}
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
