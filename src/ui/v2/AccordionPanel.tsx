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
  className: string;
};

export default function AccordionPanel({ className, open, id, title, icon, children, setOpen }: Props) {
  function toggle() {
    setOpen(id);
  }

  return (
    <div className={`${className} flex flex-col w-full`}>
      <div onClick={toggle} className={`p-2 cursor-pointer border-b-[1px] hover:bg-obs-secondary bg-obs-tertiary border-obs-modal`}>
        <div className="flex items-center justify-between">
          {title}
          <div className="flex items-center space-x-2">
            {icon}
            <ChevronRightIcon className={"w-4 h-4" + (open ? " rotate-90 transform" : "")} />
          </div>
        </div>
      </div>

      <Transition
        className="relative h-full"
        show={open}
        enter="transition duration-300 ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-250 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        {children}
      </Transition>
    </div>
  );
}
