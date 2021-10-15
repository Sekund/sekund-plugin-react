import { Note } from "@/domain/Note";
import React, { useEffect, useState } from "react";
import NotesService from "@/services/NotesService";
import NoteSyncService from "@/services/NoteSyncService";
import { useAppContext } from "@/state/AppContext";

export default function SekundHomeComponent() {
  const { fileSynced, published, publishing, comparing } = useAppContext().appState.currentNoteState;
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    (async () => {
      const notes = await NotesService.instance.getNotes(Date.now(), 20);
      setNotes(notes);
    })();
  }, []);

  function handleSync() {
    if (!publishing && !fileSynced && !comparing) {
      NoteSyncService.instance.syncFile();
    }
  }

  function handleUnpublish() {
    NoteSyncService.instance.unpublish();
  }

  function noteEntries() {
    if (notes.length > 0) {
      const children = [];
      notes.map((note: Note) => {
        children.push(
          <div key={note._id.toString()} className="p-1">
            {note.title}
          </div>
        );
      });
      return <div className="flex flex-col mt-2 space-y-1">{children}</div>;
    }
    return <div>No Notes</div>;
  }

  function maybeShowUnpublishButton() {
    if (published) {
      return (
        <div className="inline-flex flex-col justify-center w-full mt-4 text-center">
          <button type="button" className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium leading-4 bg-transparent rounded-md shadow-sm text-accent-4 hover:bg-accent-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-4" onClick={() => handleUnpublish()} style={{ border: "1px solid" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2">Un-publish</span>
          </button>
        </div>
      );
    } else return null;
  }

  return (
    <div className="w-full h-full">
      <div className="inline-flex flex-col justify-center w-full text-center">
        <button type="button" className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-accent-4 rounded-md shadow-sm focus:outline-none ${comparing || fileSynced ? "hover:bg-gray-1 bg-gray-1 text-gray-4" : "bg-accent-0 text-accent-4 hover:bg-accent-2"} ${comparing || publishing ? "animate-pulse" : ""}`} onClick={() => handleSync()} style={{ border: "solid 1px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${publishing ? "animate-bounce" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="ml-2">{published ? "Sync Note" : "Publish Note"}</span>
        </button>
      </div>
      {maybeShowUnpublishButton()}
      {noteEntries()}
    </div>
  );
}
