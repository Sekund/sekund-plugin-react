import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import withConnectionStatus from "@/ui/withConnectionStatus";
import React, { useEffect, useReducer } from "react";
import { ChatAlt2Icon, HomeIcon, MenuIcon, PlusIcon, UserGroupIcon, UserIcon } from "@heroicons/react/solid";
import ReactTimeAgo from "react-time-ago";
import { useTranslation } from "react-i18next";
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import es from 'javascript-time-ago/locale/es.json'
import fr from 'javascript-time-ago/locale/fr.json'
import nl from 'javascript-time-ago/locale/nl.json'
import { TFile } from "obsidian";

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(fr)
TimeAgo.addLocale(nl)
TimeAgo.addLocale(es)

type Props = {
  view: { addAppDispatch: Function };
  notesService: NotesService;
}

export const SekundHomeComponent = ({ notesService }: Props) => {
  const { i18n } = useTranslation();
  const { appState } = useAppContext();
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };

  const { notes } = notesState;

  async function fetchNotes() {
    const notes = await notesService.getNotes(Date.now(), 30);
    notesDispatch({ type: NotesActionKind.ResetNotes, payload: notes });
  }

  useEffect(() => {
    if (appState.generalState === "allGood") {
      if (!notesService) notesService = NotesService.instance;
      fetchNotes();
    }
  }, [appState.generalState])

  function openFileAtPath(path: string) {
    const file = appState.plugin.app.vault.getAbstractFileByPath(path);
    if (file) {
      appState.plugin.app.workspace.activeLeaf.openFile(file as TFile)
    } else {
      // TODO: add a warning
    }
  }

  function stats(note: Note) {
    const children = [];
    if (note.sharing.peoples && note.sharing.peoples.length > 0) {
      children.push(<div key="sppls" className="flex items-center"><UserIcon className="w-4 h-4" />{note.sharing.peoples.length}</div>)
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
      {notes.map((note: Note) => (
        <React.Fragment key={note._id.toString()}>
          <div className="flex flex-col px-3 py-2 text-sm cursor-pointer bg-obs-primary-alt"
            onClick={() => openFileAtPath(note.path)}>
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

export default (props: Props) => withConnectionStatus(props)(SekundHomeComponent)