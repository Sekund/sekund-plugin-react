import { TFile } from "obsidian";
import React from "react";

type Props = {
  currentFile?: TFile;
  children: React.ReactNode;
};

export default function ({ currentFile, children }: Props) {
  return (
    <div className={`relative flex flex-col w-full text-left`}>
      <div className="px-6 mt-1 text-sm text-center">
        {currentFile === undefined ? <div>&lt; no active file &gt;</div> : <div className="truncate">Current note: {currentFile?.name}</div>}
      </div>
      {currentFile ? children : null}
    </div>
  );
}
