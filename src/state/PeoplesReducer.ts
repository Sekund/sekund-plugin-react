import { People } from "@/domain/People";
import { Group } from "@/domain/Group";

export type PeoplesState = {
  peoples: People[] | undefined;
  groups: Group[] | undefined;
  nPeoples: number;
  nGroups: number;
};

export const initialPeoplesState: PeoplesState = {
  peoples: undefined,
  groups: undefined,
  nPeoples: 0,
  nGroups: 0,
};

export enum PeoplesActionKind {
  SetPeoples,
  SetGroups,
  UpdateGroup,
  AddGroup,
  RemoveGroup,
  SetNetworkStats,
}

export type PeoplesAction = {
  type: PeoplesActionKind;
  payload: any;
};

export default function PeopleReducer(state: PeoplesState, action: PeoplesAction): PeoplesState {
  const { type, payload } = action;

  switch (type) {
    case PeoplesActionKind.SetPeoples:
      return { ...state, peoples: payload, nPeoples: payload.length };
    case PeoplesActionKind.SetGroups:
      return { ...state, groups: payload, nGroups: payload.length };
    case PeoplesActionKind.UpdateGroup:
      const updtGroup: Group = payload;
      return { ...state, groups: state.groups?.map((g) => (g._id?.equals(updtGroup._id) ? updtGroup : g)) };
    case PeoplesActionKind.AddGroup:
      const newGroup: Group = payload;
      return { ...state, groups: state.groups ? [...state.groups, newGroup] : [newGroup] };
    case PeoplesActionKind.RemoveGroup:
      const groupToRemove: Group = payload;
      return { ...state, groups: state.groups!!.filter((g) => !g._id.equals(groupToRemove._id)) };
    case PeoplesActionKind.SetNetworkStats:
      return { ...state, ...payload };

    default:
      return state;
  }
}
