import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  done: () => void;
};

export default function AddUser({ done }: Props) {
  const { t } = useTranslation();

  function sendRequest() {}

  return (
    <div className="flex flex-col px-4 my-12">
      <div className="flex flex-col justify-center my-12">
        <div className="text-xl">{t("requestSharingPermission")}</div>
        <input className="w-full mt-8" type="text" placeholder={t("searchByFullnameOrEmail")} />
        <button className="mt-8 mod-cta" onClick={sendRequest}>
          {t("sendRequest")}
        </button>
      </div>
      <div className="flex items-center space-x-1 cursor-pointer" onClick={done}>
        <ArrowNarrowLeftIcon className="w-6 h-6" />
        <span>{t("back")}</span>
      </div>
    </div>
  );
}
