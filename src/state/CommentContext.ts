import { CommentAction, CommentState } from "@/state/CommentReducer";
import React from "react";

export type CommentContextType = {
  commentState: CommentState;
  commentDispatch: React.Dispatch<CommentAction>;
};

const CommentContext = React.createContext({} as CommentContextType);

export function useCommentContext() {
  return React.useContext(CommentContext);
}

export default CommentContext;
