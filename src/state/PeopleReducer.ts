import { People } from "@/domain/People";

export type PeopleState = {
  people: People | undefined;
  activeType: "sharing" | "shared";
};

export const initialPeopleState: PeopleState = {
  people: undefined,
  activeType: "sharing",
};

export enum PeopleActionKind {
  SetPeople,
  SetActiveType,
}

export type PeopleAction = {
  type: PeopleActionKind;
  payload: any;
};

export default function PeopleReducer(state: PeopleState, action: PeopleAction): PeopleState {
  const { type, payload } = action;

  switch (type) {
    case PeopleActionKind.SetPeople:
      return { ...state, people: payload };
    case PeopleActionKind.SetActiveType:
      return { ...state, activeType: payload };

    default:
      return state;
  }
}
