import CredentialsValidator from "@/ui/auth/CredentialsValidator";
import { MailIcon } from "@heroicons/react/solid";
import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Realm from "realm-web";
import i18nConf from "../../i18n.config";

type Page = "sendConfirmationLink" | "confirmationLinkSent";

type Props = {
  workspaceId: string;
  workspaceName: string;
  backToLogin: () => void;
  sbPage?: Page;
};

export default function Register({ workspaceId, workspaceName, sbPage, backToLogin }: Props) {
  const { i18n, t } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [page, setPage] = useState<"sendConfirmationLink" | "confirmationLinkSent">(sbPage || "sendConfirmationLink");

  async function register(email: string, password: string) {
    try {
      await new Realm.App(workspaceId).emailPasswordAuth.registerUser(email, password);
      setPage("confirmationLinkSent");
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

  return (
    <div className="flex flex-col items-center">
      {page === "sendConfirmationLink" ? (
        <>
          <div className="mb-8 text-xl text-center w-form">
            <div className="inline-block" style={{ width: "66%" }}>
              {t("registerToWorkspace")}
            </div>
            <div className="font-medium text-obs-accent">{workspaceName}</div>
          </div>
          <CredentialsValidator action={register} actionLabel={t("register")} />
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openAlert}
            autoHideDuration={6000}
            onClose={() => setOpenAlert(false)}
          >
            <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{ width: "100%" }}>
              <span className="leading-4">{alertMessage}</span>
            </Alert>
          </Snackbar>
        </>
      ) : (
        <>
          <div className="mb-8 text-xl text-center w-form">
            <div className="font-medium text-obs-accent">{workspaceName}</div>
            <MailIcon className="w-20 h-20" />
            <div className="inline-block" style={{ width: "80%" }}>
              {t("verificationLinkSent")}
            </div>
            <div className="inline-block mt-2 text-sm">{t("verificationLinkSentDesc")}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="inline-block w-full">
              <button className="flex items-center justify-center w-full mt-4 mr-0 text-center mod-cta" onClick={backToLogin}>
                <span>{t("backToLogin")}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
