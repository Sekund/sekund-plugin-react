import UpdateItem from "@/ui/v2/notifications/UpdateItem";
import { useUpdatesContext } from "@/ui/v2/state/UpdatesContext";
import { Update } from "@/ui/v2/state/UpdatesReducer";
import React from "react";

export default function Notifications() {
  const { updatesState } = useUpdatesContext();
  const { updates } = updatesState;

  return (
    <div className="flex flex-col pt-2 space-y-2">
      {updates.map((update: Update) => (
        <UpdateItem update={update} key={update.id} />
      ))}
    </div>
  );
}
