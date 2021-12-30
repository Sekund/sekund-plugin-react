import { EmojiAction, EmojiState } from "@/state/EmojiReducer";
import React from "react";

export type EmojiContextType = {
  emojiState: EmojiState;
  emojiDispatch: React.Dispatch<EmojiAction>;
};

const EmojiContext = React.createContext({} as EmojiContextType);

export function useEmojiContext() {
  return React.useContext(EmojiContext);
}

export default EmojiContext;
