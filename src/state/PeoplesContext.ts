import { PeoplesAction, PeoplesState } from "@/state/PeoplesReducer";
import React from "react";

type PeoplesContextType = {
  peoplesState: PeoplesState;
  peoplesDispatch: React.Dispatch<PeoplesAction>;
};

const PeoplesContext = React.createContext({} as PeoplesContextType);

export function usePeoplesContext() {
  return React.useContext(PeoplesContext);
}

export default PeoplesContext;
