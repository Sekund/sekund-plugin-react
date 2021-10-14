export type AT = {
  setAccessToken: (v: string) => void;
  accessToken: string;
};

export type SelectOption = { value: { id: string; type: "user" | "group" }; label: string };
