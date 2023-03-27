import { Note } from "@/domain/Note";
import { NoteCommentedUpdate, NoteNotification } from "@/domain/Notification";
import { PeopleId } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import UsersService from "@/services/UsersService";
import { ChatAltIcon } from "@heroicons/react/solid";
import React from "react";

function NoteCommentedTitle({ update }: { update: NoteCommentedUpdate }) {
  const nUpdates = update.by.length;
  return (
    <>
      <ChatAltIcon className="w-4 h-4" />
      <span>{`${nUpdates > 1 ? `New comments (${nUpdates})` : "New comment"}`}</span>
    </>
  );
}

// TODO: add group avatar if the note is shared with a group
function ItemAvatar({note}: {note: Note}) {
  const author: PeopleId | undefined = UsersService.instance?.getUserInfo(note.userId.toString());
  return peopleAvatar(author, 8);
}

function NoteCommentedContent({ noteNotification }: { noteNotification: NoteNotification }) {
  const note = noteNotification.payload;
  return (
    <div className={`flex items-center pl-3 pr-1 py-2 space-x-2 text-sm bg-accent-1 text-accent-4`}>
      <div className="flex-shrink-0">
        <ItemAvatar note={noteNotification.payload}/>
      </div>
      <div className="flex flex-col overflow-hidden">
        <div className="">{note.title}</div>
        <div className="text-sm">{note.updated}</div>
      </div>
    </div>
  );
}

export { NoteCommentedTitle, NoteCommentedContent };
