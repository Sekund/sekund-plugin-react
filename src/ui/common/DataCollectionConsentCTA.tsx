import { avatarImage } from "@/helpers/avatars";
import UsersService from "@/services/UsersService";
import { useAppContext } from "@/state/AppContext";
import ObjectID from "bson-objectid";
import posthog from "posthog-js";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  dismiss: () => void;
};

export default function DataCollectionConsentCTA({ dismiss }: Props) {
  const { t } = useTranslation();
  const { appState } = useAppContext();
  const userProfile = useRef(appState.userProfile);

  function consent() {
    userProfile.current.consentedToTrackBehaviouralDataInOrderToImproveTheProduct = true;
    UsersService.instance.saveUser(userProfile.current);
    postHogCB(true);
    dismiss();
  }

  function doNotConsent() {
    userProfile.current.consentedToTrackBehaviouralDataInOrderToImproveTheProduct = false;
    UsersService.instance.saveUser(userProfile.current);
    postHogCB(false);
    dismiss();
  }

  function postHogCB(consent: boolean) {
    if (consent) {
      appState.plugin!.startCapturing();
    }
  }

  return (
    <div className="rounded-md bg-yellow-50 p-2 w-full">
      <div className="flex">
        <div className="flex-shrink-0">
          {avatarImage(
            "https://sekund-sekund-assets.s3.amazonaws.com/avatars/61b3ed5c048b84e9c12d2a07/profile_2013_480x480.jpg",
            "Candide",
            new ObjectID(),
            8
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-yellow-800">{t("consentInvite")}</div>
          <div className="mt-2">
            <div className="-mx-2 -my-1.5 flex justify-end">
              <a
                onClick={doNotConsent}
                className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
              >
                {t("noWay")}
              </a>
              <a
                onClick={consent}
                className="ml-3 mr-2 bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
              >
                {t("sure")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
