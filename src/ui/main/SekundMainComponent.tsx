import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import { HeightAdjustable, HeightAdjustableHandle } from "@/ui/common/HeightAdjustable";
import { SekundGroupsComponent } from "@/ui/groups/SekundGroupsComponent";
import { SekundHomeComponent } from "@/ui/home/SekundHomeComponent";
import AddApiKeyModal from "@/ui/main/ApiKeyModal";
import { SekundNoteComponent } from "@/ui/note/SekundNoteComponent";
import { SekundPeoplesComponent } from "@/ui/peoples/SekundPeoplesComponent";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { Popover } from "@headlessui/react";
import { ChevronDownIcon, CloudUploadIcon, PlusIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type MainComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  notesService: NotesService | undefined;
  syncDown: (path: string, userId: string) => void,
  syncUp: () => void;
  unpublish: () => void;
}

export type ViewType = "home" | "peoples" | "groups";

const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};


export const SekundMainComponent = (props: MainComponentProps) => {

  const { t } = useTranslation(["common", "plugin"])

  const { appState } = useAppContext();
  const [showViews, setShowViews] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [showAddApiModal, setShowAddApiModal] = useState<boolean>(false);
  const [viewType, setViewType] = useState<ViewType>('home');
  const scrollPositions = useRef({ home: 0, groups: 0, peoples: 0 })
  const previousView = usePrevious(viewType);
  const viewRef = useRef<any>();

  function getViewTypeView() {
    if (previousView) {
      scrollPositions.current[previousView] = viewRef.current?.scrollTop;
    }
    if (scrollPositions.current[viewType] && viewRef.current) {
      setTimeout(() => viewRef.current.scrollTop = scrollPositions.current[viewType], 20);
    }
    return <>
      <SekundHomeComponent className={`${viewType !== "home" ? 'hidden' : ''}`} {...props} />
      <SekundPeoplesComponent className={`${viewType !== "peoples" ? 'hidden' : ''}`} {...props} />
      <SekundGroupsComponent className={`${viewType !== "groups" ? 'hidden' : ''}`} {...props} />
    </>
  }

  function showViewTypes(evt: any) {
    setShowViews(true);
    const hideViewTypes = () => {
      setShowViews(false);
      document.removeEventListener("click", hideViewTypes);
    }
    document.addEventListener("click", hideViewTypes)
    evt.stopPropagation();
  }

  function showTeamsMenu(evt: any) {
    setShowTeams(true);
    const hideTeamsMenu = () => {
      setShowTeams(false);
      document.removeEventListener("click", hideTeamsMenu);
    }
    document.addEventListener("click", hideTeamsMenu)
    evt.stopPropagation();
  }

  function renderAddApiKeyModal() {
    if (showAddApiModal) {
      return <AddApiKeyModal setOpen={setShowAddApiModal} subdomain={subdomain} />
    }
    return null
  }

  function showApiKeyModal(subdomain: string | null) {
    setSubdomain(subdomain);
    setShowAddApiModal(true);
    setTimeout(() => setShowTeams(false), 20);
  }

  return (

    <div className="fixed inset-0 grid h-full" style={{ gridTemplateRows: 'auto 1fr auto' }}>
      <div className="flex items-center justify-between w-full py-1">
        <div className="flex flex-col items-center mt-1 ml-2 text-obs-muted">
          <div className="flex items-center" onClick={showViewTypes}>
            <div onClick={() => { setViewType("home"); setShowViews(false); }} className={`flex items-center px-2 mr-0 space-x-2 truncate rounded-none opacity-${viewType === 'home' ? '100' : '50'} cursor-pointer`}>
              <CloudUploadIcon className="w-6 h-6" />
            </div>
            <div onClick={() => { setViewType("peoples"); setShowViews(false); }} className={`flex items-center pr-2 mr-0 space-x-2 truncate rounded-none opacity-${viewType === 'peoples' ? '100' : '50'} cursor-pointer`}>
              <UsersIcon className="w-6 h-6" />
            </div>
            <div onClick={() => { setViewType("groups"); setShowViews(false); }} className={`flex items-center mr-0 space-x-2 truncate rounded-none opacity-${viewType === 'groups' ? '100' : '50'} cursor-pointer`}>
              <UserGroupIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-1 mr-2 text-obs-muted" onClick={showTeamsMenu}>
          <div className="flex items-center">
            <span>{appState.plugin?.settings.subdomain}</span>
            <ChevronDownIcon className="w-6 h-6" />
          </div>
          {
            showTeams ?
              (<Popover className="relative">
                <Popover.Panel className="fixed z-20 right-1" static>
                  <div className="flex flex-col">
                    {Object.keys(appState.plugin?.settings.apiKeys || {}).map(subdomain => {
                      return (
                        <button onClick={() => showApiKeyModal(subdomain)} key={subdomain} className="flex items-center px-2 py-2 mr-0 space-x-2 truncate border-t rounded-none">
                          <span>{subdomain}</span>
                        </button>)
                    })}
                    <button onClick={() => showApiKeyModal(null)} className="flex items-center px-2 py-2 mr-0 space-x-2 truncate border-t rounded-none">
                      <PlusIcon className="w-6 h-6" />
                      <span>{t('plugin:addApiKey')}</span>
                    </button>
                  </div>
                </Popover.Panel>
              </Popover>)
              : null
          }
        </div>
      </div>

      <div ref={viewRef} className="relative overflow-auto">
        {getViewTypeView()}
      </div>

      <HeightAdjustable initialHeight={400}>
        <HeightAdjustableHandle />
        <div className="relative h-full overflow-auto bg-obs-primary">
          <SekundNoteComponent {...props} />
        </div>
      </HeightAdjustable>

      {renderAddApiKeyModal()}

    </div >
  )


}

export default (props: MainComponentProps) => withConnectionStatus(props)(SekundMainComponent)