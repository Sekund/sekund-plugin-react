import NotesService from "@/services/NotesService";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import { HeightAdjustable, HeightAdjustableHandle } from "@/ui/common/HeightAdjustable";
import { SekundGroupsComponent } from "@/ui/groups/SekundGroupsComponent";
import { SekundHomeComponent } from "@/ui/home/SekundHomeComponent";
import TeamsModal from "@/ui/main/TeamsModal";
import ViewsModal from "@/ui/main/ViewsModal";
import { SekundNoteComponent } from "@/ui/note/SekundNoteComponent";
import { SekundPeoplesComponent } from "@/ui/peoples/SekundPeoplesComponent";
import withConnectionStatus from "@/ui/withConnectionStatus";
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

  const { appState } = useAppContext();
  const [showViewsModal, setShowViewsModal] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('home');

  function renderViewsModal() {
    if (showViewsModal) {
      return <ViewsModal setOpen={setShowViewsModal} setViewType={setViewType} />
    } else {
      return null;
    }
  }

  function renderTeamsModal() {
    if (showTeamsModal) {
      return <TeamsModal setOpen={setShowTeamsModal} />
    } else {
      return null;
    }
  }

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

  return (

    <div className="fixed inset-0 grid h-full" style={{ gridTemplateRows: 'auto 1fr auto' }}>

      <div className="flex items-center justify-between w-full py-1">
        <div className="flex items-center ml-2 text-obs-muted" onClick={() => setShowViewsModal(true)}>
          {getViewTypeIcon()}
          <ChevronDownIcon className="w-6 h-6" />
        </div>
        <div className="flex items-center mr-1 text-obs-muted" onClick={() => setShowTeamsModal(true)}>
          <span>{appState.plugin?.settings.subdomain}</span>
          <ChevronDownIcon className="w-6 h-6" />
        </div>
      </div>

      <div className="overflow-auto">
        {getViewTypeView()}
      </div>

      <HeightAdjustable initialHeight={400}>
        <HeightAdjustableHandle />
        <SekundNoteComponent {...props} />
      </HeightAdjustable>
      {renderViewsModal()}
      {renderTeamsModal()}

    </div >
  )


}

export default (props: MainComponentProps) => withConnectionStatus(props)(SekundMainComponent)