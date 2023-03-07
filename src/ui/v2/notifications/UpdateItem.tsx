import { Update } from "@/ui/v2/state/UpdatesReducer";
import React from "react";

type Props = {
  update: Update;
};

export default function UpdateItem({ update }: Props) {
  if (update.type === "note") {
    return <div className="p-4 bg-blue-300 border-2 border-blue-600 rounded-md"></div>;
  } else if (update.type === "permissionRequest") {
    return <div className="p-4 bg-red-300 border-2 border-red-600 rounded-md">New permission request</div>;
  } else {
    return <div className="p-4 bg-red-300 border-2 border-red-600 rounded-md">New permission granted</div>;
  }
}
