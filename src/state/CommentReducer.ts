export type CommentState = {
  emoji: any | undefined;
  commentText: { text: string; commit: boolean };
  preview: boolean;
};

export const initialCommentState: CommentState = {
  emoji: undefined,
  commentText: { text: "", commit: false },
  preview: false,
};

export enum CommentActionKind {
  SetEmoji,
  SetCommentText,
  SetPreview,
}

export type CommentAction = {
  type: CommentActionKind;
  payload: any;
};

export default function CommentReducer(state: CommentState, action: CommentAction): CommentState {
  const { type, payload } = action;

  switch (type) {
    case CommentActionKind.SetEmoji:
      return { ...state, emoji: payload };
    case CommentActionKind.SetCommentText:
      return { ...state, commentText: payload };
    case CommentActionKind.SetPreview:
      return { ...state, preview: payload };

    default:
      return state;
  }
}
