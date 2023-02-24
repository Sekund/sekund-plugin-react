import { useAppContext } from "@/state/AppContext";
import { ShieldExclamationIcon } from "@heroicons/react/solid";
import { TFile } from "obsidian";
import React from "react";

type Props = {
  currentFile?: TFile;
  children: React.ReactNode;
};

export default function ({ currentFile, children }: Props) {
  const { appState } = useAppContext();

  function Status() {
    if (appState.plugin?.settings.sekundFolderPath) {
      if (currentFile?.path.startsWith(appState.plugin?.settings.sekundFolderPath)) {
        return (
          <div className="flex p-8 space-x-1 text-sm text-center text-obs-muted align-center">
            <ShieldExclamationIcon className="w-4 h-4" />
            <span>You cannot share this file</span>
          </div>
        );
      }
    }
    return <>{children}</>;
  }

  return (
    <div className={`absolute inset-0 flex flex-col w-full text-left`}>
      <div className="px-6 mt-4 text-sm text-center text-obs-muted">
        {currentFile === undefined ? <div>&lt; no active file &gt;</div> : <div className="truncate">Current note: {currentFile?.name}</div>}
      </div>
      <Status />
    </div>
  );
}
