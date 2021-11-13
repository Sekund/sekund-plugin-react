/* This example requires Tailwind CSS v2.0+ */
import { ViewType } from "@/ui/main/SekundMainComponent";
import { CloudUploadIcon, UserGroupIcon, UsersIcon, XIcon } from "@heroicons/react/solid";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  setOpen: (v: boolean) => void;
  setViewType: (type: ViewType) => void;
};

export default function GroupModal({ setOpen, setViewType }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const shade = useRef<any>();

  function setType(type: ViewType) {
    setViewType(type);
    setOpen(false);
  }

  return (
    <div ref={shade} onClick={(evt) => { if (evt.target === shade.current) { setOpen(false) } }} className="absolute inset-0 flex flex-col items-center justify-center bg-obs-cover">
      <div className="relative z-20 inline-block p-6 px-4 pt-5 pb-4 text-left rounded-lg bg-obs-primary" style={{ minWidth: '220px' }} >
        <div className="absolute top-0 right-0 pt-4 pr-4 sm:block">
          <div className="flex flex-col justify-center rounded-md cursor-pointer bg-primary hover:text-obs-muted focus:outline-none" onClick={() => setOpen(false)}>
            <span className="sr-only">{t('close')}</span>
            <XIcon className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full my-8 space-y-4">
          <button onClick={() => setType("home")} className="flex items-center mr-0 space-x-1"><CloudUploadIcon className="h-6 w-h" />Your Shares</button>
          <button onClick={() => setType("peoples")} className="flex items-center mr-0 space-x-1"><UsersIcon className="h-6 w-h" />Peoples</button>
          <button onClick={() => setType("groups")} className="flex items-center mr-0 space-x-1"><UserGroupIcon className="h-6 w-h" />Groups</button>
        </div>
      </div>
    </div >
  );
}
