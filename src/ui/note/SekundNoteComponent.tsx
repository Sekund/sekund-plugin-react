import { isSharing, Note } from "@/domain/Note";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import { useAppContext } from "@/state/AppContext";
import GlobalState from "@/state/GlobalState";
import Loader from "@/ui/common/LoaderComponent";
import NoteMetadataComponent from "@/ui/note/NoteMetadataComponent";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid } from "@/utils";
import { CheckIcon, CloudDownloadIcon, ShareIcon, TrashIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  view: { addAppDispatch: Function };
  syncUp: () => void;
  syncDown: (id: ObjectID, userId: string) => void;
  unpublish: () => void;
};

export const SekundNoteComponent = ({ syncUp, syncDown, unpublish }: Props) => {
  const { appState } = useAppContext();
  const { fileSynced, publishing, fetching, updating } = appState.currentNoteState;
  const { t } = useTranslation(["common", "plugin"]);
  const { remoteNote, currentFile } = appState;
  const { userProfile } = appState;

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(listenerId, new SekundEventListener(["updateNote"], reloadNote));
    return () => {
      eventsWatcher?.removeEventListener(listenerId);
    };
  }, []);

  function reloadNote(evt: any) {
    (async () => {
      const currentRemoteNote = GlobalState.instance.appState.remoteNote;
      if (currentRemoteNote && evt.data._id.equals(currentRemoteNote._id)) {
        if (evt.updateTime > currentRemoteNote.updated) {
          syncDown(currentRemoteNote._id, currentRemoteNote.userId.toString());
        }
      }
    })();
  }

  function isSharedNote() {
    if (remoteNote && remoteNote.sharing) {
      if (remoteNote.sharing.peoples && remoteNote.sharing.peoples.length > 0) {
        return true;
      }
      if (remoteNote.sharing.groups && remoteNote.sharing.groups.length > 0) {
        return true;
      }
    }
    return false;
  }

  function SyncButton() {
    if (!remoteNote) return null;
    return (
      <a key="sync" onClick={handleSync} className={`flex items-center justify-center space-x-1 ${footerTextColor}`}>
        <svg
          className={`w-4 h-4 ${updating ? "animate-spin" : ""} flex-shrink-0`}
          viewBox="0 0 42.676513671875 46.36460876464844"
          width="42.676513671875"
          height="46.36460876464844"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M 4.209 45.954 C 5.744 45.954 6.988 44.71 6.988 43.175 L 6.988 37.336 C 17.065 47.615 34.427 43.775 39.229 30.205 C 39.998 28.209 38.318 26.128 36.205 26.46 C 35.168 26.622 34.311 27.355 33.99 28.354 C 30.421 38.443 17.269 40.884 10.317 32.748 C 10.125 32.525 9.941 32.294 9.764 32.059 L 18.104 32.059 C 20.244 32.059 21.581 29.743 20.511 27.89 C 20.015 27.03 19.098 26.501 18.104 26.501 L 4.209 26.501 C 2.674 26.501 1.43 27.745 1.43 29.28 L 1.43 43.175 C 1.43 44.71 2.674 45.954 4.209 45.954 Z M 4.231 20.784 C 5.679 21.295 7.266 20.536 7.777 19.089 C 11.347 9 24.498 6.559 31.45 14.694 C 31.642 14.918 31.826 15.148 32.003 15.384 L 23.663 15.384 C 21.523 15.384 20.186 17.7 21.256 19.553 C 21.753 20.413 22.67 20.942 23.663 20.942 L 37.558 20.942 C 39.093 20.942 40.338 19.698 40.338 18.163 L 40.338 4.268 C 40.338 2.128 38.022 0.791 36.169 1.861 C 35.309 2.357 34.779 3.275 34.779 4.268 L 34.779 10.107 C 24.702 -0.172 7.34 3.668 2.539 17.238 C 2.028 18.685 2.787 20.273 4.234 20.784 Z"
            clipRule="evenodd"
            transform="matrix(-1, 0, 0, -1, 41.7680015563965, 47.43833541870118)"
          />
        </svg>
        <span className="flex-shrink-0 nowrap">{updating ? t("updating") : t("update")}</span>
      </a>
    );
  }

  function handleSync() {
    if (!publishing && !fileSynced && !fetching) {
      syncUp();
    }
  }

  function handleUnpublish() {
    if (confirm(t("areYouSure"))) {
      unpublish();
    }
  }

  function uploadButtonLabel() {
    if (publishing) {
      return t("plugin:uploading");
    }
    if (remoteNote) {
      return t("plugin.update");
    }
    return t("plugin:uploadToSekund");
  }

  function uploadButtonDesc() {
    if (!publishing && !fetching) return t("plugin:uploadToSekundDesc");
    return "";
  }

  function uploadButton() {
    return (
      <div className="flex flex-col items-center p-2">
        <button onClick={handleSync} className={`flex items-center justify-center mod-cta  ${fetching || publishing ? "animate-pulse" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 ${publishing ? "animate-bounce" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="inline-block ml-1">{uploadButtonLabel()}</span>
        </button>
        <span className="p-2 mt-2 text-xs text-center text-obs-muted">{uploadButtonDesc()}</span>
      </div>
    );
  }

  function isOwnNote(note: Note) {
    if (note.userId && note.userId.equals) {
      return note.userId.equals(userProfile._id);
    }
  }

  // render
  // console.log("notestate", appState.currentFile, appState.currentNoteState, appState.remoteNote)

  // there is not currentFile

  let mainPanel: JSX.Element;

  if (!currentFile && remoteNote) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-2">
        <span className={`p-2 mb-2 text-xs text-center text-obs-normal`}>
          {t("noteCannotBeFoundLocally", { noteTitle: remoteNote.title.replace(".md", "") })}
        </span>
        <button onClick={handleUnpublish} className="flex items-center cursor-pointer">
          <TrashIcon className="w-4 h-4 mr-1" />
          {t("plugin:deleteFromSekund")}
        </button>
        <span className={`p-2 my-2 text-xs text-center text-obs-muted`}>{t("plugin:deleteFromSekundDesc")}</span>
        <button onClick={() => syncDown(remoteNote._id, userProfile._id.toString())} className="flex items-center mt-2">
          <CloudDownloadIcon className="w-4 h-4 mr-1" />
          <span>{t("downloadNote")}</span>
        </button>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="h-full animate-pulse">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Loader className="h-20" />
        </div>
      </div>
    );
  }

  const footerTextColor = fetching ? "text-obs-faint" : "text-obs-muted";

  if (!remoteNote) {
    mainPanel = (
      <div className="h-full">
        <div className="flex flex-col items-center justify-center w-full h-full mod-cta">{uploadButton()}</div>
      </div>
    );
  } else {
    const footerTextColor = fetching ? "text-obs-faint" : "text-obs-muted";
    const children: Array<JSX.Element> = [];

    mainPanel = (
      <>
        {remoteNote && !isSharing(remoteNote) ? (
          <NoteMetadataComponent note={remoteNote} view="sharing" />
        ) : (
          <NoteMetadataComponent note={remoteNote} />
        )}
        <div className={`absolute bottom-0 left-0 right-0 flex flex-col py-1 bg-obs-primary-alt ${footerTextColor}`}>
          <div className="flex items-center justify-between px-2 text-sm">{children}</div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="absolute z-10 flex-shrink-0 w-full px-2 py-1 bg-obs-primary border-obs- text-obs-muted">
        <div className="flex justify-between space-x-2">
          {currentFile ? (
            <div className="flex items-center space-x-1 overflow-hidden">
              <span className="flex items-center overflow-hidden cursor-pointer text-obs-normal">
                <span className="truncate">{currentFile?.name.replace(/\.md/, "")}</span>
                {remoteNote && isOwnNote(remoteNote) ? (
                  <span className="flex items-center flex-shrink-0" onClick={handleUnpublish}>
                    <TrashIcon aria-label={t("plugin:deleteFromSekund")} className="w-4 h-4 mr-1"></TrashIcon>
                  </span>
                ) : null}
              </span>
            </div>
          ) : (
            <div>&nbsp;</div>
          )}
          <div className="flex-shrink-0">
            {fileSynced ? (
              <span className="flex items-center flex-shrink-0 space-x-1 nowrap" key="uptd">
                <CheckIcon className="w-4 h-4"></CheckIcon>
                {t("uptodate")}
              </span>
            ) : (
              <SyncButton />
            )}
          </div>
        </div>
      </div>
      <div className="relative flex-grow h-full mt-8 overflow-auto">{mainPanel}</div>
    </div>
  );
};

export default (props: Props) => withConnectionStatus(props)(SekundNoteComponent);
