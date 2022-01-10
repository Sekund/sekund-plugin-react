import ApiKeyService from "@/services/ApiKeyService";
import { useAppContext } from "@/state/AppContext";
import ResetPassword from "@/ui/auth/ResetPassword";
import Loader from "@/ui/common/LoaderComponent";
import Tooltip from "@/ui/common/Tooltip";
import { makeid, validateEmail } from "@/utils";
import { EyeIcon, EyeOffIcon, LoginIcon } from "@heroicons/react/solid";
import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Realm from "realm-web";
import i18nConf from "../../i18n.config";

type Page = "login" | "lostPassword";

type Props = {
  workspaceId: string;
  workspaceName: string;
  navigation?: JSX.Element;
  sbPage?: Page;
};

export default function Login({ workspaceId, workspaceName, navigation, sbPage }: Props) {
  const { t } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  const { appState } = useAppContext();
  const emailField = useRef<any>();
  const passwordField = useRef<any>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [badEmailFormat, setBadEmailFormat] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [page, setPage] = useState<Page>(sbPage || "login");

  function togglePasswordVisible() {
    const fieldType = passwordField.current?.type;
    passwordField.current.type = fieldType === "password" ? "text" : "password";
    setPasswordVisible(!passwordVisible);
  }

  function checkFormIsValid() {
    const validEmail = !!validateEmail(emailField.current.value);
    const formIsValid = validEmail && passwordField.current.value.length >= 8;
    setFormIsValid(formIsValid);
    return formIsValid;
  }

  function onKeyUp(evt: React.KeyboardEvent) {
    const valid = checkFormIsValid();
    if (valid && evt.code === "Enter") {
      signIn();
    }
  }

  function lostPassword() {
    setPage("lostPassword");
  }

  if (appState) {
    const { generalState } = appState;
    useEffect(() => {
      setBusy(generalState === "connecting");
    }, [generalState]);
  }

  async function signIn() {
    const validEmail = !!validateEmail(emailField.current.value);
    if (!validEmail) {
      setBadEmailFormat(true);
      return;
    }
    const appUser = await logIn();
    if (appUser) {
      const apiKeyService = new ApiKeyService(appUser);
      const { key } = await apiKeyService.ensureApiKey(appState.plugin?.app.vault.getName() || makeid(12));
      await appState.plugin?.addApiKey(workspaceName, key);
      appState.plugin?.attemptConnection(true);
    } else {
      console.log("login error");
    }
  }

  async function logIn() {
    try {
      setBusy(true);
      const appUser = await new Realm.App(workspaceId).logIn(Realm.Credentials.emailPassword(emailField.current.value, passwordField.current.value));
      return appUser;
    } catch (error) {
      setBusy(false);
      setOpenAlert(true);
      setAlertMessage("Login error, please try again");
    }
  }

  if (page === "login") {
    return (
      <div className="flex flex-col items-center">
        <div className="inline-block w-form">
          <div className="mb-8 text-xl text-center">
            <div className="font-medium text-obs-accent">{workspaceName}</div>
            <div className="inline-block" style={{ width: "66%" }}>
              {t("signInToWorkspace")}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="inline-block w-full">
              <div className="pb-1 text-obs-muted">{t("emailAddress")}</div>
              <div className="relative">
                <input
                  autoFocus
                  className="w-full"
                  onKeyUp={busy ? undefined : onKeyUp}
                  disabled={busy}
                  key="email"
                  type="text"
                  ref={emailField}
                  placeholder={t("yourEmailAddress")}
                />
                <Tooltip open={badEmailFormat} setOpen={(o) => setBadEmailFormat(o)} text={t("badEmailFormat")} />
              </div>
              <div className="py-1 text-obs-muted">{t("password")}</div>
              <div className="relative flex items-center">
                <input
                  className="w-full"
                  key="password"
                  disabled={busy}
                  onKeyUp={busy ? undefined : onKeyUp}
                  ref={passwordField}
                  type="password"
                  placeholder="••••••••"
                />
                {passwordVisible ? (
                  <EyeIcon onClick={togglePasswordVisible} className="absolute z-10 w-4 h-4 right-2 text-obs-muted hover:text-obs-normal" />
                ) : (
                  <EyeOffIcon onClick={togglePasswordVisible} className="absolute z-10 w-4 h-4 right-2 text-obs-muted hover:text-obs-normal" />
                )}
              </div>
              <div className="h-2"></div>
              <button
                onClick={busy ? undefined : signIn}
                className={`flex items-center justify-center w-full mt-4 mr-0 space-x-1 text-center ${formIsValid ? "mod-cta" : ""}`}
              >
                {busy ? (
                  <Loader className="w-8 h-8" />
                ) : (
                  <>
                    <span>{t("signIn")}</span>
                    <LoginIcon className="w-4 h-4 transform rotate-180" />
                  </>
                )}
              </button>
              <div className="flex flex-col">
                <div className="h-4" />
                <a className="text-sm truncate cursor-pointer" onClick={lostPassword}>
                  {t("lostPassword")}
                </a>
                {navigation}
              </div>
            </div>
          </div>
        </div>
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
      </div>
    );
  } else return <ResetPassword workspaceId={workspaceId} workspaceName={workspaceName} backToLogin={() => setPage("login")} />;
}
