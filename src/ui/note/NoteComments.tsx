import { Note } from "@/domain/Note";
import { getAvatar } from "@/helpers/avatars";
import { isVisible } from "@/helpers/visibility";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { useEventsContext } from "@/state/EventsContext";
import { EventsActionKind } from "@/state/EventsReducer";
import { useNotesContext } from "@/state/NotesContext";
import { NotesActionKind } from "@/state/NotesReducer";
import NoteCommentComponent from "@/ui/note/NoteCommentComponent";
import React, { Fragment, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

export default function NoteComments() {
  const { appState } = useAppContext();
  const { userProfile, plugin, remoteNote } = appState;

  const guestImage = userProfile.image;
  const guestName = userProfile.name;
  const guestEmail = userProfile.email;
  // const { notesState, notesDispatch } = useNotesContext();
  const { eventsState, eventsDispatch } = useEventsContext();
  const sendButton = useRef<HTMLButtonElement>(null);
  const [areaText, setAreaText] = useState("");

  const localComments = remoteNote?.comments || [];

  // useEffect(() => {
  //   if (!eventsState.event || !remoteNote) {
  //     return;
  //   }
  //   const evt = eventsState.event;
  //   switch (evt.type) {
  //     case "addComment":
  //       if (evt.data.noteId.equals(remoteNote._id)) {
  //         if (evt.updateTime > remoteNote.updated) {
  //           const updtNote = {
  //             ...remoteNote,
  //             comments: [...(remoteNote.comments || []), evt.data],
  //           };
  //           notesDispatch({
  //             type: NotesActionKind.SetNote,
  //             payload: updtNote,
  //           });
  //           updateNote(updtNote as Note);
  //         }
  //         eventsDispatch({ type: EventsActionKind.Consume, payload: null });
  //       }
  //       break;
  //     case "removeComment":
  //       if (evt.data.noteId.equals(notesState.note?._id)) {
  //         if (evt.updateTime > notesState.note.updated) {
  //           const updtNote = {
  //             ...notesState.note,
  //             comments: notesState.note?.comments.filter((c) => !(c.updated === evt.data.updated && c.created === evt.data.created)),
  //           };
  //           notesDispatch({
  //             type: NotesActionKind.SetNote,
  //             payload: updtNote,
  //           });
  //           updateNote(updtNote as Note);
  //         }
  //         eventsDispatch({ type: EventsActionKind.Consume, payload: null });
  //       }
  //       break;
  //     case "editComment":
  //       if (evt.data.noteId.equals(notesState.note?._id)) {
  //         if (evt.updateTime > notesState.note.updated) {
  //           const { text, commentIdx } = evt.data;
  //           const updtNote = {
  //             ...notesState.note,
  //             comments: notesState.note?.comments.map((c, index) => (index === commentIdx ? { ...c, text } : c)),
  //           };
  //           notesDispatch({
  //             type: NotesActionKind.SetNote,
  //             payload: updtNote,
  //           });
  //           updateNote(updtNote as Note);
  //         }
  //         eventsDispatch({ type: EventsActionKind.Consume, payload: null });
  //       }
  //       break;
  //   }
  // }, [eventsState.event]);

  // function updateNote(updtNote: Note) {
  //   notesDispatch({ type: NotesActionKind.UpdateNote, payload: updtNote });
  // }

  async function addComment() {
    // if (notesState.note) {
    //   const textarea = document.getElementById("comment") as HTMLTextAreaElement;
    //   NotesService.instance.addNoteComment(notesState.note._id, textarea.value, plugin.user.customData._id);
    //   textarea.value = "";
    // }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      ensureSendVisible();
    }
  }

  function ensureSendVisible() {
    if (sendButton.current) {
      const inView = isVisible(sendButton.current);
      if (!inView) {
        let position = sendButton.current.getBoundingClientRect();
        window.scrollTo(position.left, position.top + window.scrollY + 200);
      }
    }
  }

  function clearComment() {
    const textarea = document.getElementById("comment") as HTMLTextAreaElement;
    setAreaText((textarea.value = ""));
  }

  return (
    <div className="px-2 mb-16 ">
      <div className="flex flex-col space-y-4">
        {localComments?.map((noteComment) => {
          return (
            <Fragment key={noteComment.created}>
              <NoteCommentComponent comment={noteComment}></NoteCommentComponent>
            </Fragment>
          );
        })}
      </div>
      <div className={`sm:col-span-2 ${localComments.length > 0 ? 'mt-8' : ''}`}>
        <label htmlFor="message" className="flex items-center h-10 space-x-2">
          <span>{getAvatar(guestName, guestImage, guestEmail, 8)}</span> <span>You</span>
        </label>
        <div className="mt-1">
          <TextareaAutosize onChange={(e) => setAreaText(e.target.value)} onKeyDown={(e: any) => handleKeydown(e)} onHeightChange={ensureSendVisible} minRows={2} id="comment" name="message" rows={2} className="relative block w-full px-2 py-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-warm-gray-300" aria-describedby="message-max" defaultValue={""} />
        </div>
      </div>
      <div className="flex justify-end w-full pt-2">
        <button onClick={() => clearComment()} type="button">
          Cancel
        </button>
        <button ref={sendButton} onClick={addComment} type="button">
          Send
        </button>
      </div>
    </div>
  );
}
