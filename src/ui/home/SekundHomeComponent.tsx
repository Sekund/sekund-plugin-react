import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import NoteSyncService from "@/services/NoteSyncService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { ChatAlt2Icon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import { TFile } from "obsidian";
import React, { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";

export type HomeComponentProps = {
  view: { addAppDispatch: Function };
  notesService: NotesService | undefined;
}

export const SekundHomeComponent = ({ notesService }: HomeComponentProps) => {
  const { i18n } = useTranslation();
  const { appState, appDispatch } = useAppContext();
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };
  let gen: AsyncGenerator<Realm.Services.MongoDB.ChangeEvent<any>, any, unknown>;

  const { notes } = notesState;

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
  }, [appState.generalState])

  useEffect(() => {
    console.log("putting notes watcher in place...");
    (async () => {
      if (appState.plugin) {
        const notes = appState.plugin.user.mongoClient("mongodb-atlas").db(appState.plugin.settings.subdomain).collection("notes");
        if (notes) {
          gen = notes.watch();
          for await (const change of gen) {
            handleNotesChange(change);
          }
        }
      }
    })()
    return () => {
      gen.return(undefined);
    }
  }, []);

  async function handleNotesChange(change: Realm.Services.MongoDB.ChangeEvent<any>) {
    const updtNotes = await NotesService.instance.getNotes(Date.now(), 10000);
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: updtNotes });
  }

  function openNoteFile(note: Note) {
    const file = appState.plugin?.app.vault.getAbstractFileByPath(note.path);
    if (file && appState.plugin?.app.workspace.activeLeaf) {
      appState.plugin.app.workspace.activeLeaf.openFile(file as TFile)
    } else {
      NoteSyncService.instance.noFile(note);
    }
  }

  function stats(note: Note) {
    const children: Array<JSX.Element> = [];
    if (note.sharing.peoples && note.sharing.peoples.length > 0) {
      children.push(<div key="sppls" className="flex items-center"><UsersIcon className="w-4 h-4" />{note.sharing.peoples.length}</div>)
    }
    if (note.sharing.groups && note.sharing.groups.length > 0) {
      children.push(<div key="sgps" className="flex items-center"><UserGroupIcon className="w-4 h-4" />{note.sharing.groups.length}</div>)
    }
    if (note.comments && note.comments.length > 0) {
      children.push(<div key="cmts" className="flex items-center"><ChatAlt2Icon className="w-4 h-4" />{note.comments.length}</div>)
    }
    return <div className="flex items-center space-x-1 text-obs-muted">{children}</div>
  }

  return (<NotesContext.Provider value={notesProviderState}>
    <div className="flex flex-col w-full overflow-auto space-y-2px">
      {notes?.map((note: Note) => (
        <React.Fragment key={note._id.toString()}>
          <div className="flex flex-col px-3 py-2 text-sm cursor-pointer bg-obs-primary-alt"
            onClick={() => openNoteFile(note)}>
            <div>
              {note.title.replace(".md", "")}
            </div>
            <div className="flex items-center justify-between">
              <ReactTimeAgo className="text-obs-muted" date={+note.created} locale={i18n.language} />
              {stats(note)}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  </NotesContext.Provider>)
}

export default (props: HomeComponentProps) => withConnectionStatus(props)(SekundHomeComponent)