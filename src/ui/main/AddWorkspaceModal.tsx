import { XIcon } from "@heroicons/react/solid";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  workspaceId: string;
  setOpen: (v: boolean) => void;
};

export default function ApiKeyModal({ setOpen, workspaceId }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const shade = useRef<any>();

  return (
    <div
      ref={shade}
      onClick={(evt) => {
        if (evt.target === shade.current) {
          setOpen(false);
        }
      }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center a bg-obs-cover"
    >
      <div className="relative inline-block w-full max-w-xs p-6 px-4 pt-5 pb-4 text-left rounded-lg sm:my-8 bg-obs-primary">
        <div className="absolute top-0 right-0 pt-4 pr-4 sm:block">
          <div
            className="flex flex-col justify-center rounded-md cursor-pointer bg-primary hover:text-obs-muted focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">{t("cancel")}</span>
            <XIcon className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
        <div className="mb-4">{/* <APIInfo workspaceId={workspaceId} close={() => setOpen(false)} /> */}</div>
      </div>
    </div>
  );
}
