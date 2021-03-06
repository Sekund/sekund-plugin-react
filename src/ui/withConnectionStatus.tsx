import AppContext from "@/state/AppContext";
import AppReducer, { AppActionKind } from "@/state/AppReducer";
import GlobalState from "@/state/GlobalState";
import Login from "@/ui/auth/Login";
import SetWorkspace from "@/ui/auth/SetWorkspace";
import Loader from "@/ui/common/LoaderComponent";
import Onboarding from "@/ui/Onboarding";
import { makeid } from "@/utils";
import { ArrowNarrowLeftIcon, CloudIcon, EmojiSadIcon, ExclamationCircleIcon, StatusOfflineIcon } from "@heroicons/react/solid";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import i18nConf from "../i18n.config";

type Props = {
  view: { addAppDispatch: Function };
};

const withConnectionStatus = (props: Props) => (WrappedComponent: any) => (moreProps: any) => {
  const { t, i18n } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  const [action, setAction] = useState<"none" | "login" | "register">("none");
  const workspaceId = useRef("");
  const workspaceName = useRef("");
  const [retryVisible, setRetryVisible] = useState(false);

  const localizedAppState = window.moment
    ? { ...GlobalState.instance.appState, id: makeid(3), locale: (window.moment as any).locale() }
    : { ...GlobalState.instance.appState, id: makeid(3) };

  const [appState, appDispatch] = useReducer(AppReducer, localizedAppState);
  const appProviderState = {
    appState,
    appDispatch,
  };
  const sekundRoot = useRef<HTMLDivElement>(null);

  // allow SekundView and NotesService to mutate the state
  if (props.view) {
    props.view.addAppDispatch(appProviderState);
  }

  useEffect(() => {
    i18n.changeLanguage(appState.locale);
  }, [appState.locale]);

  useEffect(() => {
    setRetryVisible(false);
    setAction("none");
  }, [appState.generalState]);

  useEffect(() => {
    // sync obsidian's theme-dark/theme-light to tailwind's dark/light
    // theme classes
    if (sekundRoot.current) {
      var darkModeElement = sekundRoot.current.closest(".theme-dark");
      if (!darkModeElement) {
        darkModeElement = sekundRoot.current.closest(".theme-light");
      }
      if (!darkModeElement) {
        darkModeElement = document.body;
      }
      if (darkModeElement) {
        var isDark = darkModeElement.classList.contains("theme-dark");
        sekundRoot.current.classList.add(isDark ? "dark" : "light");
        appDispatch({ type: AppActionKind.SetIsDark, payload: isDark });
        const sekundRootElement = sekundRoot.current;
        var observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === "class") {
              if (mutation.target) {
                var isDark = (mutation.target as HTMLElement).classList.contains("theme-dark");
                if (isDark) {
                  sekundRootElement.classList.add("dark");
                } else {
                  sekundRootElement.classList.remove("dark");
                }
                appDispatch({ type: AppActionKind.SetIsDark, payload: isDark });
              }
            }
          });
        });
        observer.observe(darkModeElement, { attributes: true });
      }
    }
  }, []);

  function workspaceChosen(wsId: string, wsName: string) {
    workspaceId.current = wsId;
    workspaceName.current = wsName;
    setAction("login");
  }

  function retry() {
    appState.plugin?.attemptConnection(true);
    setRetryVisible(false);
  }

  type StatusProps = {
    children?: JSX.Element | JSX.Element[];
  };

  const Status = ({ children }: StatusProps) => {
    const backNavigation = (
      <>
        <div className="h-4"></div>
        <div className="flex justify-between overflow-none">
          <a className="flex items-center space-x-1 truncate cursor-pointer" onClick={() => setAction("none")}>
            <ArrowNarrowLeftIcon className="w-4 h-4" />
            <span>{t("back")}</span>
          </a>
        </div>
      </>
    );
    switch (action) {
      case "login":
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-form">
              <Login
                workspaceId={workspaceId.current}
                workspaceName={workspaceName.current || appState.plugin?.subdomain || "error"}
                navigation={backNavigation}
              />
            </div>
          </div>
        );
      case "register":
        return (
          <div className="absolute inset-0 flex flex-col justify-center p-8">
            <SetWorkspace success={workspaceChosen} navigation={backNavigation} />
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            {children}
            <Onboarding firstPage="chooseWorkspace" />
          </div>
        );
    }
  };

  return (
    <AppContext.Provider value={appProviderState}>
      <div ref={sekundRoot} className="sekund">
        {(() => {
          switch (appState.generalState) {
            case "allGood":
              return <WrappedComponent {...props} />;
            case "connecting":
              setTimeout(() => setRetryVisible(true), 15000);
              return (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="flex justify-center mb-2 animate-pulse">
                    <CloudIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col space-y-4 text-center">
                    {t("plugin:connecting")}...
                    <div className="font-medium text-obs-accent">{appState.plugin?.settings.subdomain}</div>
                  </div>
                  <Loader className="h-20" />
                  {retryVisible ? (
                    <button className="mt-2 mr-0 mod-cta" onClick={retry}>
                      {t("tryAgain")}
                    </button>
                  ) : null}
                </div>
              );
            case "loginError": {
              return (
                <Status>
                  <div className="flex justify-center mb-2">
                    <ExclamationCircleIcon className="w-6 h-6" />
                  </div>
                  <div className="text-center ">{t("plugin:loginError")}</div>
                  <div className="mt-2 text-sm text-center ">{t("plugin:loginErrorDesc")}</div>
                </Status>
              );
            }
            case "noApiKey":
              return (
                <Status>
                  <div className="flex justify-center mb-2">
                    <EmojiSadIcon className="w-6 h-6" />
                  </div>
                  <div className="text-center ">{t("plugin:noApiKey")}</div>
                  <div className="mt-2 text-sm text-center">{t("plugin:noApiKeyDesc")}</div>
                </Status>
              );
            case "noSettings":
              return (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <Onboarding />
                </div>
              );
            case "noSubdomain":
              return (
                <Status>
                  <div className="flex justify-center mb-2">
                    <EmojiSadIcon className="w-6 h-6" />
                  </div>
                  <div className="text-center ">{t("plugin:noSubdomain")}</div>
                  <div className="mt-2 text-sm text-center ">
                    <Trans components={{ a: <a /> }}>{t("plugin:noSubdomainDesc")}</Trans>
                  </div>
                </Status>
              );
            case "noSuchSubdomain":
              return (
                <Status>
                  <div className="flex justify-center mb-2">
                    <EmojiSadIcon className="w-6 h-6" />
                  </div>
                  <div className="text-center ">{t("plugin:noSuchSubdomain")}</div>
                </Status>
              );
            case "offline":
              return (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="flex justify-center mb-2">
                    <StatusOfflineIcon className="w-6 h-6" />
                  </div>
                  <div className="text-center ">{t("plugin:offline")}</div>
                  <div className="mt-2 text-sm text-center">{t("plugin:offlineDesc")}</div>
                </div>
              );
            case "unknownError":
              return (
                <Status>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <div className="flex justify-center mb-2">
                      <EmojiSadIcon className="w-6 h-6" />
                    </div>
                    <div className="text-center ">{t("plugin:unknownError")}</div>
                    <div className="mt-2 text-sm text-center ">{t("plugin:unknownErrorDesc")}</div>
                  </div>
                </Status>
              );
          }
        })()}
      </div>
    </AppContext.Provider>
  );
};

export default withConnectionStatus;
