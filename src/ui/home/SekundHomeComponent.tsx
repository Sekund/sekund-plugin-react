import NotesService from "@/services/NotesService";
import NotesContext from "@/state/NotesContext";
import NotesReducer, { initialNotesState, NotesActionKind } from "@/state/NotesReducer";
import withConnectionStatus from "@/ui/withConnectionStatus";
import React, { useEffect, useReducer } from "react";

type Props = {
  view: { addAppDispatch: Function };
  notesService: NotesService;
}

export const SekundHomeComponent = ({ notesService }: Props) => {
  const [notesState, notesDispatch] = useReducer(NotesReducer, initialNotesState);
  const notesProviderState = {
    notesState,
    notesDispatch,
  };

  useEffect(() => {
    (async () => {
      const notes = await notesService.getNotes(Date.now(), 30);
      notesDispatch({ type: NotesActionKind.ResetNotes, payload: notes });
    })()
  }, [])

  return (<NotesContext.Provider value={notesProviderState}>
    <div>And here you will see the user's list of published notes: {notesState.notes.length}</div>
  </NotesContext.Provider>)
}

export default (props: Props) => withConnectionStatus(props)(SekundHomeComponent)