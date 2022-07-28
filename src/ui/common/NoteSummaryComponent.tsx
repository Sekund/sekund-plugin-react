import { Group } from "@/domain/Group";
import { isSharing, Note } from "@/domain/Note";
import { PeopleId } from "@/domain/People";
import { NoteSummary } from "@/domain/Types";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import NotesService from "@/services/NotesService";
import UsersService from "@/services/UsersService";
import { useAppContext } from "@/state/AppContext";
import { useNotesContext } from "@/state/NotesContext";
import { NotesActionKind } from "@/state/NotesReducer";
import { ViewType } from "@/ui/main/SekundMainComponent";
import { isUnread, makeid } from "@/utils";
import { ChatAlt2Icon, EyeIcon, LinkIcon, ShareIcon } from "@heroicons/react/solid";
import React, { MouseEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";

type Props = {
  noteSummary: Note;
  context: ViewType;
  handleNoteClicked: (note: Note) => void;
};

export default function NoteSummaryComponent({ noteSummary, handleNoteClicked, context }: Props) {
  const { i18n, t } = useTranslation();
  const { appState } = useAppContext();

  const { notesState, notesDispatch } = useNotesContext();

  const { unreadNotes, noteUpdates } = appState;
  const { note: currentNote } = notesState;
  const [isActiveNote, setIsActiveNote] = useState(false);
  const [note, setNote] = useState(noteSummary);
  const { userProfile } = appState;

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
      setNote(currentNote);
    } else setIsActiveNote(false);
  }, [currentNote]);

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.addEventListener(
      listenerId,
      new SekundEventListener(["note.addComment", "note.removeComment", "note.rename", "note.metadataUpdate"], async (fullDocument: any) => {
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

  async function updateNote(updtNote: NoteSummary) {
    if (appState.plugin?.notesSyncService) {
      const fullNote = await appState.plugin?.notesSyncService.getNoteById(updtNote._id);
      if (fullNote) {
        setNote(fullNote);
      }
    }
  }

  function readStatusClass() {
    return isUnread(note) ? "font-bold" : "";
  }

  async function noteClicked(evt: MouseEvent) {
    if (NotesService.instance) {
      await NotesService.instance.setNoteIsRead(note._id);
    }
    setIsActiveNote(true);
    notesDispatch({ type: NotesActionKind.SetNote, payload: note });
    notesDispatch({ type: NotesActionKind.SetNoteIsRead, payload: note._id });
    handleNoteClicked(note);
    setNote({ ...note, isRead: Date.now() });
  }

  function PinIcon() {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="thumbtack"
        className="w-3 h-3 ml-1 transform rotate-45 svg-inline--fa fa-thumbtack"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path
          fill="currentColor"
          d="M160 456c0 1.25 .2813 2.467 .8438 3.576l24 47.1c2.938 5.891 11.38 5.906 14.31 0l24-47.1C223.6 458.7 224 457 224 456V383.1H160V456zM298 214.3l-12.25-118.3H328c13.25 0 24-10.75 24-23.1V23.1C352 10.75 341.3 0 328 0h-272C42.75 0 32 10.75 32 23.1v47.1C32 85.25 42.75 95.1 56 95.1h42.22L85.97 214.3C37.47 236.8 0 277.3 0 327.1c0 13.25 10.75 23.1 24 23.1h336c13.25 0 24-10.75 24-23.1C384 276.8 346 236.6 298 214.3z"
        ></path>
      </svg>
    );
  }

  function sharingGroups(groups: Group[]) {
    return (
      <div className="flex p-1 -space-x-1 overflow-hidden">
        {groups.map((group, idx) => {
          return <React.Fragment key={idx}>{groupAvatar(group, 6)}</React.Fragment>;
        })}
      </div>
    );
  }

  function sharing(sharing) {
    let children: Array<JSX.Element> = [];
    if (sharing && sharing.groups && sharing.groups.length > 0) {
      children.push(
        <div key="sharing.groups" className="flex -space-x-1 overflow-hidden">
          {sharingGroups(sharing.groups)}
        </div>
      );
    }
    if (sharing && sharing.peoples && sharing.peoples.length > 0) {
      if (sharing.groups && sharing.groups.length > 0) {
        children.push(
          <span className="mr-1" key="sharing.plus">
            +
          </span>
        );
      }
      children.push(
        <div key="sharing.people" className="flex -space-x-1 overflow-hidden">
          {sharing.peoples.map((people, idx) => {
            return <React.Fragment key={idx}>{peopleAvatar(people, 5)}</React.Fragment>;
          })}
        </div>
      );
    }
    if (note && isOwnNote(note) && children.length > 1) {
      return (
        <div key="sharing.share" className="flex items-center flex-shrink-0 cursor-pointer">
          {children}
        </div>
      );
    }
    return null;
  }

  function isOwnNote(note: Note) {
    if (note.userId && note.userId.equals) {
      return note.userId.equals(userProfile._id);
    }
  }

  function summaryContents() {
    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div className={`${readStatusClass()}`}>
            {isActiveNote ? "❯ " : isUnread(note) ? <span className="text-lg">•</span> : ""}
            {note.title.replace(".md", "")}
            {context === "groups" && note.pinned ? <PinIcon /> : null}
          </div>
          <div>{note && isSharing(note) ? sharing(note.sharing) : null}</div>
        </div>
        <div className="flex items-center justify-between">
          <ReactTimeAgo className="text-obs-muted" date={+note.updated} locale={i18n.language} />
          <div className="flex items-center space-x-1">
            {/* {note.refCount && note.refCount > 0 ? (
              <div key="refCount" className="flex items-center space-x-2">
                <LinkIcon className="w-3 h-3 text-obs-normal" />
                {note.refCount}
              </div>
            ) : null} */}
            {note.readCount && note.readCount > 0 ? (
              <div key="readCount" className="flex items-center space-x-2">
                <EyeIcon className="w-3 h-3 text-obs-normal" />
                {note.readCount}
              </div>
            ) : null}
            {note.comments && note.comments.length > 0 ? (
              <div key="cmts" className="flex items-center space-x-2">
                <ChatAlt2Icon className="w-4 h-4 text-obs-normal" />
                {note.comments.length}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  function summary() {
    return (
      <div
        className={`flex flex-col px-3 py-2 text-sm cursor-pointer hover:bg-obs-secondary ${isActiveNote ? "bg-obs-secondary" : ""}`}
        style={isUnread(note) ? { borderLeft: "6px solid #1F85DE" } : {}}
        onMouseDown={noteClicked}
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
          style={isUnread(note) ? { borderLeft: "6px solid #1F85DE" } : {}}
          onMouseDown={noteClicked}
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
