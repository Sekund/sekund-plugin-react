import { Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import React from "react";
type Props = {
  setOpen: (id: string) => void;
  id: string;
  open: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
  title: React.ReactNode;
};

export default function AccordionPanel({ open, id, title, icon, children, setOpen }: Props) {
  function toggle() {
    setOpen(id);
  }

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={toggle}
        className="p-2 cursor-pointer hover:bg-obs-secondary bg-obs-tertiary border-obs-modal"
        style={{ borderBottom: "1px solid" }}
      >
        <div className="flex items-center justify-between">
          {title}
          <div className="flex items-center space-x-2">
            {icon}
            <ChevronRightIcon className={"w-4 h-4" + (open ? " rotate-90 transform" : "")} />
          </div>
        </div>
      </div>

      <Transition
        show={open}
        enter="transition duration-300 ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-250 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <div>{children}</div>
      </Transition>
    </div>
  );
}
