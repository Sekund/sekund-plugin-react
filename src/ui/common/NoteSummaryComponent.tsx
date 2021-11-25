import { Group } from "@/domain/Group";
import { Note } from "@/domain/Note";
import { People } from "@/domain/People";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { useNotesContext } from "@/state/NotesContext";
import { NotesActionKind } from "@/state/NotesReducer";
import { usePeoplesContext } from "@/state/PeoplesContext";
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
  group?: Group;
};

export default function NoteSummaryComponent({ noteSummary, handleNoteClicked, context, group }: Props) {
  const { t, i18n } = useTranslation();
  const { appState } = useAppContext();

  const { peoplesState } = usePeoplesContext();
  const { notesDispatch } = useNotesContext();

  const { remoteNote, currentFile } = appState;
  const { userProfile } = appState;
  const { unreadNotes } = appState;
  const [note, setNote] = useState(noteSummary);

  useEffect(() => {
    for (const unreadNote of unreadNotes.all) {
      if (unreadNote._id.equals(note._id)) {
        console.log("there are now " + unreadNote.comments.length + " comments");
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

  function getAuthor() {
    if (note.userId.equals(userProfile._id)) {
      return t("you");
    } else if (group) {
      let noteUser: People | undefined = peoplesState.currentGroup?.peoples.filter((p) => p._id.equals(note.userId))[0];
      if (noteUser?.name && noteUser.name.trim() !== "") {
        return noteUser.name;
      }
      if (noteUser?.email && noteUser.email.trim() !== "") {
        return noteUser.email;
      }
    }
    return note.userId.toString();
  }

  return (
    <div
      className={`flex flex-col px-3 py-2 text-sm transition cursor-pointer bg-obs-primary-alt hover:bg-obs-tertiary ${
        isCurrentNote() ? "bg-obs-tertiary" : ""
      }`}
      onClick={noteClicked}
    >
      <div>
        {context === "groups" ? (
          <div className="flex items-start justify-between overflow-auto">
            <span className={`${readStatusClass()}`}>{note.title.replace(".md", "")}</span>
            <span className="truncate" style={{ maxWidth: "35%" }}>
              {getAuthor()}
            </span>
          </div>
        ) : (
          <span className={`${readStatusClass()}`}>{note.title.replace(".md", "")}</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <ReactTimeAgo className="text-obs-muted" date={+note.created} locale={i18n.language} />
        {note.comments && note.comments.length > 0 ? (
          <div className="flex items-center space-x-1 text-obs-muted">
            <ChatAlt2Icon className="w-4 h-4" />
            {note.comments.length}
          </div>
        ) : null}
      </div>
    </div>
  );
}
