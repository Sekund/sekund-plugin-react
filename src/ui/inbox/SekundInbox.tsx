import { useAppContext } from "@/state/AppContext";
import { InboxIcon, XIcon } from "@heroicons/react/solid";
import React from "react";

type Props = {
  close: () => void;
};

export default function SekundInbox({ close }: Props) {
  return (
    <div className="flex flex-col w-full px-2">
      <div className="relative flex justify-center py-1 mt-1 space-x-1 text-lg">
        <InboxIcon className="w-6 h-6" />
        <span className="capitalize">Inbox</span>
        <XIcon className="absolute w-6 h-6 cursor-pointer right-1 top-1" onClick={close} />
      </div>
    </div>
  );
}
