import { Group } from "@/domain/Group";
import { isSharing } from "@/domain/Note";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
import EventsWatcherService, { SekundEventListener } from "@/services/EventsWatcherService";
import { useAppContext } from "@/state/AppContext";
import GlobalState from "@/state/GlobalState";
import Loader from "@/ui/common/LoaderComponent";
import SharingModal from "@/ui/modals/SharingModal";
import NoteComments from "@/ui/note/NoteComments";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { makeid } from "@/utils";
import { DotsHorizontalIcon, TrashIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  view: { addAppDispatch: Function }
  syncUp: () => void;
  syncDown: (path: string, userId: string) => void;
  unpublish: () => void;
}

export const SekundNoteComponent = ({ syncUp, syncDown, unpublish }: Props) => {
  const { appState } = useAppContext();
  const { fileSynced, publishing, fetching, updating } = appState.currentNoteState;
  const { t } = useTranslation(["common", "plugin"]);
  const { remoteNote, currentFile } = appState;
  const [showSharingModal, setShowSharingModal] = useState(false);

  useEffect(() => {
    const listenerId = makeid(5);
    const eventsWatcher = EventsWatcherService.instance;
    eventsWatcher?.watchEvents();
    eventsWatcher?.addEventListener(listenerId, new SekundEventListener(["updateNote"], reloadNote))
    return () => {
      eventsWatcher?.removeEventListener(listenerId);
    }
  }, [])

  function reloadNote(evt: any) {
    (async () => {
      const currentRemoteNote = GlobalState.instance.appState.remoteNote;
      if (currentRemoteNote && evt.data._id.equals(currentRemoteNote._id)) {
        if (evt.updateTime > currentRemoteNote.updated) {
          syncDown(currentRemoteNote.path, currentRemoteNote.userId.toString())
        }
      }
    })()
  }

  function handleSync() {
    if (!publishing && !fileSynced && !fetching) {
      syncUp();
    }
  }

  function handleUnpublish() {
    unpublish();
  }

  function uploadButtonLabel() {
    if (publishing) {
      return t("plugin:uploading");
    }
    if (remoteNote) {
      return t('plugin.update');
    }
    return t('plugin:uploadToSekund');
  }

  function uploadButtonDesc() {
    if (!publishing && !fetching)
      return t('plugin:uploadToSekundDesc');
    return "";
  }

  function uploadButton() {
    return (
      <div className="flex flex-col items-center p-2">
        <button onClick={handleSync} className={`flex items-center mod-cta  ${fetching || publishing ? "animate-pulse" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${publishing ? "animate-bounce" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="ml-1">{uploadButtonLabel()}</span>
        </button>
        <span className="p-2 mt-2 text-xs text-center text-obs-muted">{uploadButtonDesc()}</span>
      </div>)
  }

  function sharingGroups(groups: Group[]) {
    return (
      <div className="flex p-1 -space-x-1 overflow-hidden">
        {groups.map((group, idx) => {
          return <React.Fragment key={idx}>{groupAvatar(group)}</React.Fragment>;
        })}
      </div>
    );
  }

  function sharing(sharing) {
    let children: Array<JSX.Element> = [];
    if (sharing && sharing.groups && sharing.groups.length > 0) {
      children.push(
        <div key="sharing.groups" className="flex -space-x-1 overflow-hidden">
          {sharingGroups(sharing.groups)}
        </div>
      );
    }
    if (sharing && sharing.peoples && sharing.peoples.length > 0) {
      if (sharing.groups && sharing.groups.length > 0) {
        children.push(<span key="sharing.plus">+</span>);
      }
      children.push(
        <div key="sharing.people" className="flex -space-x-1 overflow-hidden">
          {sharing.peoples.map((people, idx) => {
            return <React.Fragment key={idx}>{peopleAvatar(people, 5)}</React.Fragment>;
          })}
        </div>
      );
    }
    children.push(
      <a key="sharing.edit" className="flex items-center ml-1">
        <DotsHorizontalIcon className="w-4 h-4" />
      </a>
    );
    if (children.length > 1) {
      return (
        <div key="sharing.share" onClick={() => setShowSharingModal(true)} className="flex items-center flex-shrink-0 cursor-pointer">
          {children}
        </div>
      );
    }
    return (
      <button key="sharing.share" type="button">
        {t('plugin:Share')}
      </button>
    );
  }

  function renderSharingDialog() {
    if (showSharingModal && remoteNote) {
      return <SharingModal open={showSharingModal} setOpen={setShowSharingModal} note={remoteNote}></SharingModal>;
    } else {
      return null;
    }
  }

  // render
  // console.log("notestate", appState.currentFile, appState.currentNoteState, appState.remoteNote)

  // there is not currentFile
  if (!currentFile && remoteNote) {

    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-2">
        <span className={`p-2 mb-2 text-xs text-center text-obs-muted`}>{t('plugin:deleteFromSekundDesc')}</span>
        <button onClick={handleUnpublish} className="flex items-center"><TrashIcon className="w-4 h-4 mr-1" />{t('plugin:deleteFromSekund')}</button>
      </div>)

  }

  if (fetching) {
    return <div className="animate-pulse bg-obs-primary-alt">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loader className="h-20" />
      </div>
    </div>
  }

  if (!remoteNote) {

    return (
      <div className="h-full">
        <div className="flex flex-col items-center justify-center w-full h-full mod-cta">
          {uploadButton()}
        </div>
      </div>
    );

  } else {

    const footerTextColor = fetching ? 'text-obs-faint' : 'text-obs-muted';
    const children: Array<JSX.Element> = [];

    if (fileSynced) {
      children.push(<span key="uptd">{t('uptodate')}</span>)
    } else {

      children.push(
        <a key="sync" onClick={handleSync} className={`flex items-center justify-center space-x-1 ${footerTextColor}`} >
          <svg className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} viewBox="0 0 42.676513671875 46.36460876464844" width="42.676513671875" height="46.36460876464844" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" >
            <path fillRule="evenodd" d="M 4.209 45.954 C 5.744 45.954 6.988 44.71 6.988 43.175 L 6.988 37.336 C 17.065 47.615 34.427 43.775 39.229 30.205 C 39.998 28.209 38.318 26.128 36.205 26.46 C 35.168 26.622 34.311 27.355 33.99 28.354 C 30.421 38.443 17.269 40.884 10.317 32.748 C 10.125 32.525 9.941 32.294 9.764 32.059 L 18.104 32.059 C 20.244 32.059 21.581 29.743 20.511 27.89 C 20.015 27.03 19.098 26.501 18.104 26.501 L 4.209 26.501 C 2.674 26.501 1.43 27.745 1.43 29.28 L 1.43 43.175 C 1.43 44.71 2.674 45.954 4.209 45.954 Z M 4.231 20.784 C 5.679 21.295 7.266 20.536 7.777 19.089 C 11.347 9 24.498 6.559 31.45 14.694 C 31.642 14.918 31.826 15.148 32.003 15.384 L 23.663 15.384 C 21.523 15.384 20.186 17.7 21.256 19.553 C 21.753 20.413 22.67 20.942 23.663 20.942 L 37.558 20.942 C 39.093 20.942 40.338 19.698 40.338 18.163 L 40.338 4.268 C 40.338 2.128 38.022 0.791 36.169 1.861 C 35.309 2.357 34.779 3.275 34.779 4.268 L 34.779 10.107 C 24.702 -0.172 7.34 3.668 2.539 17.238 C 2.028 18.685 2.787 20.273 4.234 20.784 Z" clipRule="evenodd" transform="matrix(-1, 0, 0, -1, 41.7680015563965, 47.43833541870118)" />
          </svg>
          <span>{updating ? t('updating') : t('update')}</span>
        </a>
      )
    }

    if (remoteNote && isSharing(remoteNote)) {
      children.push(sharing(remoteNote.sharing))
    }

    return (
      <>
        {remoteNote && !isSharing(remoteNote) ?
          <div className="flex flex-col items-center justify-center w-full h-full p-2">
            <span className={`p-2 mb-2 text-xs text-center ${footerTextColor}`}>{t('plugin:shareDesc')}</span>
            <button className="mod-cta" onClick={() => setShowSharingModal(true)}>{t('plugin:Share')}</button>
          </div>
          : <NoteComments />}
        <div className={`fixed bottom-0 left-0 right-0 flex flex-col pt-1 bg-obs-primary-alt ${footerTextColor}`}>
          <div className="flex items-center justify-between px-2 text-sm">{children}</div>
          <a className={`flex items-center justify-center p-1 text-sm text-center cursor-pointer mod-cta ${footerTextColor}`} onClick={handleUnpublish}>
            <TrashIcon className="w-4 h-4 mr-1"></TrashIcon>
            {t('plugin:deleteFromSekund')}
          </a>
        </div>
        {renderSharingDialog()}
      </>)
  }
}

export default (props: Props) => withConnectionStatus(props)(SekundNoteComponent)