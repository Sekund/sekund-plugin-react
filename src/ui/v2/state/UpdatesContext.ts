import { UpdatesAction, UpdatesState } from "@/ui/v2/state/UpdatesReducer";
import React from "react";

export type UpdatesContextType = {
  updatesState: UpdatesState;
  updatesDispatch: React.Dispatch<UpdatesAction>;
};

const UpdatesContext = React.createContext({} as UpdatesContextType);

export function useUpdatesContext() {
  return React.useContext(UpdatesContext);
}

export default UpdatesContext;
