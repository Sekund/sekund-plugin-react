import Login from "@/ui/auth/Login";
import Register from "@/ui/auth/Register";
import SetWorkspace from "@/ui/auth/SetWorkspace";
import { PUBLIC_APP_ID } from "@/_constants";
import { ArrowNarrowLeftIcon, QuestionMarkCircleIcon, SparklesIcon } from "@heroicons/react/solid";
import { Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import i18nConf from "../i18n.config";

type Page = "welcome" | "chooseWorkspace" | "chooseNextStep" | "login" | "register";

type Props = {
  close?: () => void;
  firstPage?: Page;
  sbWorkspace?: string;
};

export default function Onboarding({ close, firstPage, sbWorkspace }: Props) {
  const [page, setPage] = useState<Page>(firstPage || "welcome");
  const workspaceId = useRef("");
  const workspaceName = useRef("");
  const [workspace, setWorkspace] = useState(sbWorkspace);

  const { t } = useTranslation(["common", "plugin"], { i18n: i18nConf });

  function chooseSekundWorkspace() {
    workspaceId.current = PUBLIC_APP_ID;
    workspaceName.current = "sekund";
    setWorkspace("sekund");
    setPage("chooseNextStep");
  }

  function workspaceChosen(wsId: string, wsName: string) {
    workspaceId.current = wsId;
    workspaceName.current = wsName;
    setWorkspace(wsName);
    setPage("chooseNextStep");
  }

  const Back = ({ toPage }: { toPage: Page }) => {
    return (
      <a className="flex items-center space-x-1 truncate cursor-pointer" onClick={() => setPage(toPage)}>
        <ArrowNarrowLeftIcon className="w-4 h-4" />
        <span>{t("back")}</span>
      </a>
    );
  };

  function renderStage() {
    switch (page) {
      case "welcome":
        const info = t("workspaceIdDesc");
        return (
          <div className="flex flex-col justify-center text-center">
            <div className="flex justify-center mb-2">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>{t("plugin:noSettings")}</div>

            <div className="pt-2 pb-8 text-sm text-left">
              <span>{t("onboardingWelcome")}&nbsp;</span>
              <Tooltip title={info} arrow>
                <Box sx={{ display: "inline" }}>
                  <QuestionMarkCircleIcon className="w-4 h-4 cursor-pointer" />
                </Box>
              </Tooltip>
            </div>

            <div className="mb-4">{t("chooseOne")}</div>
            <button onClick={chooseSekundWorkspace}>{t("joinSekundWorkspace")}</button>
            <div className="pt-1 text-sm text-obs-muted">({t("recommended")})</div>
            <button onClick={() => setPage("chooseWorkspace")} className="mt-5">
              {t("joinAnotherWorkspace")}
            </button>
            <div className="pt-1 text-sm text-obs-muted">{t("chooseThisOptionIfInvited")}</div>

            <div className="h-6" />
            <div className="text-sm text-center text-obs-muted">
              <Trans components={{ a: <a /> }}>{t("createYourOwnWorkspace")}</Trans>
            </div>
          </div>
        );

      case "chooseWorkspace":
        return (
          <>
            <SetWorkspace success={workspaceChosen} />

            <div className="h-4"></div>
            <div className="flex justify-between overflow-none">
              <Back toPage="welcome" />
            </div>

            <div className="h-6" />
            <div className="text-sm text-center text-obs-muted">
              <Trans components={{ a: <a /> }}>{t("createYourOwnWorkspace")}</Trans>
            </div>
          </>
        );

      case "chooseNextStep":
        return (
          <div className="flex flex-col items-center">
            <div className="inline-block w-form">
              <div className="mb-8 text-xl text-center">
                <div className="font-medium text-obs-accent">{workspace}</div>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 w-form">
              <button onClick={() => setPage("login")}>{t("signIn")}</button>
              <button onClick={() => setPage("register")}>{t("register")}</button>
              <div className="h-4"></div>
            </div>
            <div className="flex justify-between w-form overflow-none">
              <Back toPage={workspaceName.current === "sekund" ? "welcome" : "chooseWorkspace"} />
            </div>
          </div>
        );

      case "login":
        const loginNavigation = (
          <>
            <div className="h-4"></div>
            <div className="flex justify-between overflow-none">
              <Back toPage="chooseNextStep" />
            </div>
          </>
        );
        return <Login workspaceId={workspaceId.current} workspaceName={workspaceName.current} navigation={loginNavigation} />;

      case "register":
        return (
          <>
            <Register workspaceId={workspaceId.current} workspaceName={workspaceName.current} backToLogin={() => setPage("login")} />
            <div className="h-2"></div>
            <div className="flex justify-between overflow-none">
              <Back toPage="chooseNextStep" />
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return <div className="flex flex-col p-2 mt-8 space-y-2 text-left border rounded-md border-obs-modal w-form">{renderStage()}</div>;
}
