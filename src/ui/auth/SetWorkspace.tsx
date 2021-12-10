import { useAppContext } from "@/state/AppContext";
import Loader from "@/ui/common/LoaderComponent";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Snackbar, Alert, Box, Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18nConf from "../../i18n.config";

type Props = {
  success: (workspaceId: string, workspaceName: string) => void;
  navigation?: JSX.Element;
};

export default function ({ success, navigation }: Props) {
  const { t } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  const { appState } = useAppContext();
  const [workspaceValue, setWorkspaceValue] = useState("");
  const workspaceField = useRef<any>();
  const [busy, setBusy] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onKeyUp = (evt: React.KeyboardEvent) => {
    setWorkspaceValue(workspaceField.current.value);
    if (evt.code === "Enter" && workspaceField.current.value.length >= 2) {
      verifyTeam();
    }
  };

  async function verifyTeam() {
    setBusy(true);
    const appIdResult = await appState.plugin?.getRealmAppId(workspaceField.current.value || "null");
    setBusy(false);
    switch (appIdResult) {
      case undefined:
      case "noSubdomain":
      case "noSuchSubdomain":
        setOpenAlert(true);
        setAlertMessage(t("noSuchWorkspace"));
        return;
      default:
        success(appIdResult, workspaceField.current.value);
    }
  }

  const info = t("workspaceIdDesc");
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-form">
        <div className="pb-1 text-obs-muted">{t("whatWorkspaceId")}</div>
        <div className="relative flex items-center">
          <input
            autoFocus
            className="w-full"
            ref={workspaceField}
            key="subdomain"
            pattern="^([a-zA-Z0-9]([-a-zA-Z0-9]{0,14}[a-zA-Z0-9])?)$"
            type="text"
            onKeyUp={busy ? undefined : onKeyUp}
            placeholder={t("plugin:workspaceID")}
          />
          <div className="absolute pt-1 text-sm text-obs-muted right-2">
            <Tooltip title={info} arrow>
              <Box sx={{ display: "inline" }}>
                <QuestionMarkCircleIcon className="w-4 h-4 cursor-pointer" />
              </Box>
            </Tooltip>
          </div>
        </div>
        <div className="h-2"></div>
        <button
          onClick={busy ? undefined : verifyTeam}
          className={`m-0 mt-4 text-center ${!busy && workspaceValue.length >= 2 ? "mod-cta" : ""} ${busy ? "animate-pulse" : ""}`}
        >
          {busy ? (
            <div className="flex items-center justify-center w-full space-x-1">
              <span>{t("verifying")}</span>
              <Loader className="w-8 h-8" />
            </div>
          ) : (
            t("continue")
          )}
        </button>
        <div className="flex flex-col">
          <div className="h-4" />
          {navigation}
        </div>
      </div>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
        <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{ width: "100%" }}>
          <span className="leading-4">{alertMessage}</span>
        </Alert>
      </Snackbar>
    </div>
  );
}
