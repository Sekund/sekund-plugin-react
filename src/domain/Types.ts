import { Note } from "@/domain/Note";

export type AT = {
  setAccessToken: (v: string) => void;
  accessToken: string;
};

export type SelectOption = { value: { id: string; type: "user" | "group" }; label: string };

export type NoteSummary = Pick<Note, "_id" | "title" | "path" | "comments" | "updated" | "isRead">;
