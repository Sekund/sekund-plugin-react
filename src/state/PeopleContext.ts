import React from "react";
import { PeopleAction, PeopleState } from "./PeopleReducer";

type PeopleContextType = {
  peopleState: PeopleState;
  peopleDispatch: React.Dispatch<PeopleAction>;
};

const PeopleContext = React.createContext({} as PeopleContextType);

export function usePeopleContext() {
  return React.useContext(PeopleContext);
}

export default PeopleContext;
