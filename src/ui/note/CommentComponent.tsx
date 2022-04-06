import { useCommentContext } from "@/state/CommentContext";
import { CommentActionKind } from "@/state/CommentReducer";
import Markdown from "markdown-to-jsx";
import React, { useEffect, useRef } from "react";

type Props = {
  commentId: string;
  editMode: boolean;
  setEditMode: (b: boolean) => void;
};

export default function CommentComponent({ editMode, setEditMode, commentId }: Props) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const { commentState, commentDispatch } = useCommentContext();
  const initialText = useRef(commentState.commentText.text);
  const { commentText, preview } = commentState;

  function updateText(v: string, commit: boolean) {
    commentDispatch({ type: CommentActionKind.SetCommentText, payload: { text: v, commit } });
  }

  useEffect(() => {
    if (commentState && commentState.emoji) {
      if (textarea.current && textarea.current.setRangeText) {
        textarea.current.setRangeText(commentState.emoji.native);
        commentDispatch({ type: CommentActionKind.SetEmoji, payload: undefined });
        updateText(textarea.current.value, false);
      }
    }
  }, [commentState]);

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      if (!e.shiftKey) {
        if (textarea.current) {
          updateText(textarea.current.value, true);
          textarea.current.value = "";
          if (textarea.current.parentNode) {
            (textarea.current.parentNode as HTMLElement).dataset.replicatedValue = "";
          }
        }
        setEditMode(false);
      }
    }
    if (e.code === "Escape") {
      if (textarea.current) {
        updateText(initialText.current, false);
      }
      setEditMode(false);
    }
  }

  function autoexpand(commentId: string) {
    const textarea = document.getElementById(commentId) as HTMLTextAreaElement;
    if (textarea && textarea.parentNode) {
      (textarea.parentNode as HTMLElement).dataset.replicatedValue = textarea.value;
    }
  }

  if (editMode) {
    if (preview) {
      return (
        <div className="-mt-2">
          <Markdown options={{ forceBlock: true }}>{commentText.text}</Markdown>
        </div>
      );
    } else {
      setTimeout(() => autoexpand(commentId), 1);
      return (
        <div className="grow-wrap">
          <textarea
            ref={textarea}
            onInput={() => autoexpand(commentId)}
            id={commentId}
            onKeyDown={(e: any) => handleKeydown(e)}
            onChange={(evt) => updateText(evt.target.value, false)}
            className="p-1 mt-1 resize-y input"
            defaultValue={commentText.text}
            spellCheck="false"
          />
        </div>
      );
    }
  }
  return (
    <div className="-mt-2">
      <Markdown options={{ forceBlock: true }}>{commentText.text}</Markdown>
    </div>
  );
}
