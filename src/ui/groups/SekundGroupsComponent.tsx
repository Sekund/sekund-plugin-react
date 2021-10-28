import { Group } from "@/domain/Group";
import { groupAvatar, peopleAvatar } from "@/helpers/avatars";
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
          <div className="flex items-center justify-between w-auto max-w-xl mx-auto mb-4 sm:w-xl lg:px-8">
            <div>
              <div className="sm:flex sm:items-end sm:space-x-5">
                <div className="flex">{groupAvatar(group, 10)}</div>
                <div className="flex-col justify-between space-y-4 sm:flex-1 sm:min-w-0 sm:flex sm:justify-end sm:pb-1">
                  <div className="flex-1 min-w-0 mt-3 sm:hidden md:block">
                    <h1 className="text-2xl font-bold truncate text-primary">{group.name}</h1>
                  </div>
                </div>
              </div>
              <div className="flex-1 hidden min-w-0 mt-6 sm:block md:hidden">
                <h1 className="text-2xl font-bold truncate text-primary">{group.name}</h1>
              </div>
            </div>
            <div className="flex p-1 -space-x-1 overflow-hidden">
              {group.peoples.map((people) => {
                return <React.Fragment key={people._id?.toString()}>{peopleAvatar(people)}</React.Fragment>;
              })}
            </div>
          </div>
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