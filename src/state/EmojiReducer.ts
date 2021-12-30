export type EmojiState = {
  emoji: any | undefined;
};

export const initialEmojiState: EmojiState = {
  emoji: undefined,
};

export enum EmojiActionKind {
  SetEmoji,
}

export type EmojiAction = {
  type: EmojiActionKind;
  payload: { native: string };
};

export default function EmojiReducer(state: EmojiState, action: EmojiAction): EmojiState {
  const { type, payload } = action;

  switch (type) {
    case EmojiActionKind.SetEmoji:
      return { emoji: payload };

    default:
      return state;
  }
}
