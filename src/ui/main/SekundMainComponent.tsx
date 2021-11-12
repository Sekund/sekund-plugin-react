import PeoplesService from "@/services/PeoplesService";
import TeamsModal from "@/ui/main/TeamsModal";
import ViewsModal from "@/ui/main/ViewsModal";
import { SekundNoteComponent } from "@/ui/note/SekundNoteComponent";
import { SekundPeoplesComponent } from "@/ui/peoples/SekundPeoplesComponent";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { ChevronDownIcon, CloudUploadIcon, CogIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import SplitPane from "react-split-pane";

export type MainComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
  syncDown: (path: string, userId: string) => void,
  syncUp: () => void;
  unpublish: () => void;
}


export const SekundMainComponent = (props: MainComponentProps) => {

  const [showViewsModal, setShowViewsModal] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);

  function renderViewsModal() {
    if (showViewsModal) {
      return <ViewsModal setOpen={setShowViewsModal} />
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

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between flex-shrink-0 w-full py-1">
        <div className="flex items-center ml-2 text-obs-muted" onClick={() => setShowViewsModal(true)}>
          <UsersIcon className="w-6 h-6" />
          <ChevronDownIcon className="w-6 h-6" />
        </div>
        <div className="flex items-center mr-1 text-obs-muted" onClick={() => setShowTeamsModal(true)}>
          <span>app</span>
          <ChevronDownIcon className="w-6 h-6" />
        </div>
      </div>
      <SplitPane
        minSize={50}
        defaultSize={100}
        className="flex-grow"
        split="horizontal"
        primary="second"
      >
        <div className="h-full overflow-auto">
          <SekundPeoplesComponent {...props} />
        </div>
        <div className="h-full overflow-auto">
          <SekundNoteComponent {...props} />
        </div>
      </SplitPane>
      {renderViewsModal()}
      {renderTeamsModal()}
    </div>
  )


}

export default (props: MainComponentProps) => withConnectionStatus(props)(SekundMainComponent)