import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import NoteSummariesPanel from "@/ui/common/NoteSummariesPanel";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { touch } from "@/utils";
import { SparklesIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useReducer, useRef } from "react";
import { useTranslation } from "react-i18next";

export type HomeComponentProps = {
  view: { addAppDispatch: Function };
  notesService: NotesService | undefined;
  syncDown: (id: ObjectID, userId: string) => void;
  fetchUnread: () => Promise<void>;
} & React.HTMLAttributes<HTMLDivElement>;

export const SekundHomeComponent = ({ notesService, className, fetchUnread }: HomeComponentProps) => {
  const { t } = useTranslation(["common", "plugin"]);
  const { appState, appDispatch } = useAppContext();
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };
  const resumeToken = useRef(null);
  const watching = useRef(false);

  const { notes } = notesState;

  useEffect(() => {
    watchEvents();
  }, []);

  async function watchEvents() {
    if (watching.current) {
      return;
    }
    if (appState.plugin && appState.plugin.user) {
      const notes = appState.plugin.user.mongoClient("mongodb-atlas").db(appState.plugin.settings.subdomain).collection("notes");
      if (notes) {
        try {
          const cursor = resumeToken.current ? notes.watch({ resumeAfter: resumeToken.current }) : notes.watch();
          watching.current = true;
          for await (const change of cursor) {
            resumeToken.current = change._id;
            switch (change.operationType) {
              case "delete":
              case "insert":
                await fetchNotes();
                await fetchUnread();
                break;
            }
          }
          watching.current = true;
        } catch (err) {
          setTimeout(() => watchEvents(), 5000);
          watching.current = false;
        }
      }
    }
  }

  async function fetchNotes() {
    if (!notesService) {
      notesService = NotesService.instance;
    }
    const notes = await notesService.getNotes(Date.now(), 10000);
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: notes });
  }

  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchNotes();
    }
  }, [appState.generalState]);

  async function openNoteFile(note: Note) {
    await appState.plugin?.openNoteFile(note);
    touch(appDispatch, note);
  }

  if (notes && notes.length > 0) {
    return (
      <NotesContext.Provider value={notesProviderState}>
        <div className={`${className} flex flex-col w-full overflow-auto space-y-1px`}>
          <NoteSummariesPanel context="home" handleNoteClicked={openNoteFile} />
        </div>
      </NotesContext.Provider>
    );
  } else
    return (
      <div className={`${className} h-full w-full flex flex-col items-center justify-center p-8`}>
        <div className="flex justify-center mb-2">
          <SparklesIcon className="w-6 h-6" />
        </div>
        <div className="text-center ">{t("noNotes")}</div>
        <div className="mt-2 text-sm text-center ">{t("plugin:noNotesDesc")}</div>
      </div>
    );
};

export default (props: HomeComponentProps) => withConnectionStatus(props)(SekundHomeComponent);
