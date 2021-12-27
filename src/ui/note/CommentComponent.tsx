import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Markdown from "markdown-to-jsx";

type Props = {
  commentId: string;
  commentText: string;
  preview: boolean;
  editMode: boolean;
  setEditMode: (b: boolean) => void;
  setCommentText: (ct: string) => void;
};

export default function CommentComponent({ editMode, setEditMode, commentId, commentText, preview, setCommentText }: Props) {
  // let globalClickListener: EventListener;
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [areaText, setAreaText] = useState(commentText);

  function updateText(v: string) {
    setCommentText(v);
    setAreaText(v);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      if (!e.shiftKey) {
        if (textarea.current) {
          updateText(textarea.current.value);
        }
        setEditMode(false);
      }
    }
    if (e.code === "Escape") {
      if (textarea.current) {
        updateText(textarea.current.value);
      }
      setEditMode(false);
    }
  }

  function autoexpand(commentId: string) {
    const textarea = document.getElementById(commentId) as HTMLTextAreaElement;
    if (textarea.parentNode) {
      (textarea.parentNode as HTMLElement).dataset.replicatedValue = textarea.value;
    }
  }

  if (editMode) {
    if (preview) {
      return (
        <div className="-mt-2">
          <Markdown options={{ forceBlock: true }}>{areaText}</Markdown>
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
            onChange={(evt) => updateText(evt.target.value)}
            className="p-1 mt-1 input resize-y"
            defaultValue={areaText}
            spellCheck="false"
          />
        </div>
      );
    }
  }
  return (
    <div className="-mt-2">
      <Markdown options={{ forceBlock: true }}>{areaText}</Markdown>
    </div>
  );
}
