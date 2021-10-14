import React from "react";
import { NotesAction, NotesState } from "./NotesReducer";

type NotesContextType = {
  notesState: NotesState;
  notesDispatch: React.Dispatch<NotesAction>;
};

const NotesContext = React.createContext({} as NotesContextType);

export function useNotesContext() {
  return React.useContext(NotesContext);
}

export default NotesContext;
