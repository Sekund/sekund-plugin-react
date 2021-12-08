import CredentialsValidator from "@/ui/auth/CredentialsValidator";
import { ArrowNarrowLeftIcon, MailIcon, PaperAirplaneIcon } from "@heroicons/react/solid";
import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Realm from "realm-web";
import i18nConf from "../../i18n.config";

type Page = "sendResetLink" | "resetLinkSent";

type Props = {
  workspaceName: string;
  workspaceId: string;
  backToLogin: () => void;
  sbPage?: Page;
};

export default function ResetPassword({ workspaceName, workspaceId, backToLogin, sbPage }: Props) {
  const { t } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [page, setPage] = useState<Page>(sbPage || "sendResetLink");

  async function sendResetLink(email: string, password: string) {
    try {
      await new Realm.App(workspaceId).emailPasswordAuth.callResetPasswordFunction(email, password, workspaceId);
      setPage("resetLinkSent");
    } catch (err) {
      const error = err as any;
      let errorMessage = `${t("plugin:unknownError")} (${error.errorCode})`;
      switch (error.errorCode) {
        case "AccountNameInUse":
          errorMessage = t("accountNameIsInUse");
          break;
      }
      console.log("there was an error", JSON.stringify(error));
      setOpenAlert(true);
      setAlertMessage(errorMessage);
    }
  }

  const actionLabel = (
    <div className="flex items-center justify-center w-full space-x-2">
      <span>{t("sendResetLink")}</span>
      <PaperAirplaneIcon className="w-4 h-4 transform rotate-45" />
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="inline-block w-form">
        {page === "sendResetLink" ? (
          <>
            <div className="mb-8 text-xl text-center">
              <div className="font-medium text-obs-accent">{workspaceName}</div>
              <div className="inline-block" style={{ width: "66%" }}>
                {t("resetPassword")}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="inline-block w-full">
                <CredentialsValidator action={sendResetLink} actionLabel={actionLabel} noPassword />
                <div className="h-4"></div>
                <div className="flex justify-between overflow-none">
                  <a className="flex items-center space-x-1 truncate cursor-pointer" onClick={backToLogin}>
                    <ArrowNarrowLeftIcon className="w-4 h-4" />
                    <span>{t("signIn")}</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 text-xl text-center w-form">
              <div className="font-medium text-obs-accent">{workspaceName}</div>
              <MailIcon className="w-20 h-20" />
              <div className="inline-block" style={{ width: "80%" }}>
                {t("resetPasswordLinkSent")}
              </div>
              <div className="inline-block mt-2 text-sm">{t("resetPasswordLinkSentDesc")}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="inline-block w-full">
                <button onClick={backToLogin} className="flex items-center justify-center w-full mt-4 mr-0 text-center mod-cta ">
                  <span>{t("backToLogin")}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
        <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{ width: "100%" }}>
          <span className="leading-4">{alertMessage}</span>
        </Alert>
      </Snackbar>
    </div>
  );
}
