import { Group } from "@/domain/Group";
import PeoplesService from "@/services/PeoplesService";
import { useAppContext } from "@/state/AppContext";
import PeoplesReducer, { initialPeoplesState, PeoplesActionKind } from "@/state/PeoplesReducer";
import withConnectionStatus from "@/ui/withConnectionStatus";
import { EmojiSadIcon } from "@heroicons/react/solid";
import React, { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

export type GroupsComponentProps = {
  view: { addAppDispatch: Function };
  peoplesService: PeoplesService | undefined;
}

export const SekundGroupsComponent = ({ peoplesService }: GroupsComponentProps) => {
  const { appState } = useAppContext();
  const { t } = useTranslation("plugin");
  const [peoplesState, peoplesDispatch] = useReducer(PeoplesReducer, initialPeoplesState);

  const { groups } = peoplesState;

  async function fetchGroups() {
    if (!peoplesService) {
      peoplesService = PeoplesService.instance;
    }
    const groups = await peoplesService.getUserGroups();
    peoplesDispatch({ type: PeoplesActionKind.SetGroups, payload: groups });
  }

  useEffect(() => {
    if (appState.generalState === "allGood") {
      fetchGroups();
    }
  }, [appState.generalState])

  // render

  if (groups && groups.length > 0) {
    return <div className="flex flex-col space-y-2px w-xl">
      {groups.map((group: Group) => {
        return (
          <div>group name: {group.name}</div>
        );
      })}
    </div>
  } else return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-8">
      <div className="flex justify-center mb-2"><EmojiSadIcon className="w-6 h-6" /></div>
      <div className="text-center ">{t('plugin:noOne')}</div>
      <div className="mt-2 text-sm text-center ">{t('plugin:noOneDesc')}</div>
    </div>)

}

export default (props: GroupsComponentProps) => withConnectionStatus(props)(SekundGroupsComponent)