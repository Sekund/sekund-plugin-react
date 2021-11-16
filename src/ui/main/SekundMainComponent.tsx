import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { HeightAdjustable, HeightAdjustableHandle } from "@/ui/common/HeightAdjustable";
import { SekundGroupsComponent } from "@/ui/groups/SekundGroupsComponent";
import { SekundHomeComponent } from "@/ui/home/SekundHomeComponent";
import { SekundNoteComponent } from "@/ui/note/SekundNoteComponent";
import { SekundPeoplesComponent } from "@/ui/peoples/SekundPeoplesComponent";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { Popover } from "@headlessui/react";
import { ChevronDownIcon, CloudUploadIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

export type MainComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  notesService: NotesService | undefined;
  syncDown: (path: string, userId: string) => void,
  syncUp: () => void;
  unpublish: () => void;
}

export type ViewType = "home" | "peoples" | "groups";

export const SekundMainComponent = (props: MainComponentProps) => {

  const [showViews, setShowViews] = useState(false);
  // const [showTeams, setShowTeams] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('home');

  function getViewTypeIcon() {
    switch (viewType) {
      case "home":
        return <CloudUploadIcon className="w-6 h-6" />;
      case "peoples":
        return <UsersIcon className="w-6 h-6" />
      case "groups":
        return <UserGroupIcon className="w-6 h-6" />;
    }
  }

  function getViewTypeView() {
    switch (viewType) {
      case "home":
        return <SekundHomeComponent {...props} />;
      case "peoples":
        return <SekundPeoplesComponent {...props} />
      case "groups":
        return <SekundGroupsComponent {...props} />
    }
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

  return (

    <div className="fixed inset-0 grid h-full" style={{ gridTemplateRows: 'auto 1fr auto' }}>
      <div className="flex items-center justify-between w-full py-1">
        <div className="flex flex-col items-center mt-1 ml-2 text-obs-muted">
          <div className="main-component-button" onClick={showViewTypes}>
            {getViewTypeIcon()}
            <ChevronDownIcon className="w-6 h-6" />
          </div>
          {
            showViews ?
              (<Popover className="relative">
                <Popover.Panel className="absolute z-20 -ml-4" static>
                  <div className="flex flex-col">
                    <button onClick={() => { setViewType("home"); setShowViews(false); }} className="flex items-center px-2 py-2 mr-0 space-x-2 truncate rounded-none">
                      <CloudUploadIcon className="h-6 w-h" />
                      <span>Your Shares</span>
                    </button>
                    <button onClick={() => { setViewType("peoples"); setShowViews(false); }} className="flex items-center px-2 py-2 mr-0 space-x-2 truncate rounded-none">
                      <UsersIcon className="h-6 w-h" />
                      <span>Peoples</span>
                    </button>
                    <button onClick={() => { setViewType("groups"); setShowViews(false); }} className="flex items-center px-2 py-2 mr-0 space-x-2 truncate rounded-none">
                      <UserGroupIcon className="h-6 w-h" />
                      <span>Groups</span>
                    </button>
                  </div>
                </Popover.Panel>
              </Popover>)
              : null
          }
        </div>
        {/* <div className="flex items-center mr-1 text-obs-muted" onClick={() => setShowTeamsModal(true)}>
          <span>{appState.plugin?.settings.subdomain}</span>
          <ChevronDownIcon className="w-6 h-6" />
        </div> */}
      </div>

      <div className="relative overflow-auto">
        {getViewTypeView()}
      </div>

      <HeightAdjustable initialHeight={400}>
        <HeightAdjustableHandle />
        <div className="relative h-full overflow-auto">
          <SekundNoteComponent {...props} />
        </div>
      </HeightAdjustable>

    </div >
  )


}

export default (props: MainComponentProps) => withConnectionStatus(props)(SekundMainComponent)