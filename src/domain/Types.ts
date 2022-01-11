import { Note } from "@/domain/Note";

export type AT = {
  setAccessToken: (v: string) => void;
  accessToken: string;
};

export type SelectOptionType = "user" | "group";

export type SelectOption = { value: { id: string; type: SelectOptionType }; label: string };

export type NoteSummary = Pick<Note, "_id" | "title" | "path" | "comments" | "updated" | "isRead">;
