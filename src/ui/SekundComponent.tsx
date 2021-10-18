import i18nConf from '@/i18n.config';
import NotesService from "@/services/NoteSyncService";
import AppContext from "@/state/AppContext";
import AppReducer, { initialAppState } from "@/state/AppReducer";
import APIInfo from '@/ui/APIInfo';
import SekundHomeComponent from "@/ui/SekundHomeComponent";
import React, { useEffect, useReducer, useRef } from 'react';
import { Trans, useTranslation } from "react-i18next";

type Props = {
  view?: { setAppDispatch: Function };
};

const SekundComponent = ({ view }: Props) => {
  const { t, i18n, ready } = useTranslation(["common", "plugin"], { i18n: i18nConf });

  const localizedAppState = window.moment
    ? { ...initialAppState, locale: (window.moment as any).locale() }
    : initialAppState;

  const [appState, appDispatch] = useReducer(AppReducer, localizedAppState);
  const appProviderState = {
    appState,
    appDispatch,
  };
  const sekundRoot = useRef(null)


  // allow SekundView and NotesService to mutate the state
  if (view) {
    view.setAppDispatch(appProviderState);
  }

  // update the NotesService's appState whenever it gets updated
  useEffect(() => {
    i18n.changeLanguage(appState.locale)
    if (NotesService.instance) {
      NotesService.instance.appState = appState;
    }
  }, [appState]);

  useEffect(() => {
    // sync obsidian's theme-dark/theme-light to tailwind's dark/light
    // theme classes
    if (sekundRoot.current) {
      var darkModeElement = sekundRoot.current.closest('.theme-dark');
      if (!darkModeElement) {
        darkModeElement = sekundRoot.current.closest('.theme-light');
      }
      var isDark = darkModeElement.classList.contains("theme-dark");
      sekundRoot.current.classList.add(isDark ? 'dark' : 'light')
      const sekundRootElement = sekundRoot.current;
      var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            var isDark = (mutation.target as HTMLElement).classList.contains('theme-dark');
            if (isDark) {
              sekundRootElement.classList.add('dark')
            } else {
              sekundRootElement.classList.remove('dark')
            }
          }
        });
      });
      observer.observe(darkModeElement, { attributes: true });
    }
  }, [])

  return (
    <AppContext.Provider value={appProviderState}>
      <div ref={sekundRoot} className={`w-full main sekund`}>
        <div className="fixed inset-0 flex flex-col items-center justify-center p-8">
          {(() => {
            switch (appState.generalState) {
              case "allGood":
                return <SekundHomeComponent></SekundHomeComponent>;
              case "connecting":
                return (
                  <>
                    <p className="flex justify-center mb-2 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </p>
                    <p className="text-center ">{t('plugin:connecting')} https://{appState.subdomain}.sekund.io/</p>
                    <div className="mt-4 spinner">
                      <div className="bounce1" />
                      <div className="bounce2" />
                      <div className="bounce3" />
                    </div>
                  </>
                );
              case "loginError":
                return (
                  <>
                    <p className="flex justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </p>
                    <p className="text-center ">{t('plugin:loginError')}</p>
                    <p className="text-sm text-center ">{t('plugin:loginErrorDesc')}</p>
                    <APIInfo />
                  </>
                );
              case "noApiKey":
                return (
                  <>
                    <p className="flex justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </p>
                    <p className="text-center ">{t('plugin:noApiKey')}</p>
                    <p className="text-sm text-center ">{t('plugin:noApiKeyDesc')}</p>
                    <APIInfo />
                  </>
                );
              case "noSettings":
                return (
                  <>
                    <p className="flex justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </p>
                    <p className="text-center ">{t('plugin:noSettings')}</p>
                    <p className="text-sm text-center "><Trans components={{ a: <a /> }}>{t('plugin:noSettingsDesc')}</Trans></p>
                    <APIInfo />
                  </>
                );
              case "noSubdomain":
                return (
                  <>
                    <p className="flex justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </p>
                    <p className="text-center ">{t('plugin:noSubdomain')}</p>
                    <p className="mt-4 text-sm text-center "><Trans components={{ a: <a /> }}>{t('plugin:noSubdomainDesc')}</Trans></p>
                    <APIInfo />
                  </>
                );
              case "noSuchSubdomain":
                return (
                  <>
                    <p className="flex justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </p>
                    <p className="text-center ">{t('plugin:noSuchSubdomain')}</p>
                    <APIInfo />
                  </>
                );
              case "offline":
                return (
                  <>
                    <p className="flex justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                      </svg>
                    </p>
                    <p className="text-center ">{t('plugin:offline')}</p>
                    <p className="mt-4 text-sm text-center">{t('plugin:offlineDesc')}</p>
                  </>
                );
              case "unknownError":
                return (
                  <>
                    <p className="flex justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                      </svg>
                    </p>
                    <p className="text-center ">{t('plugin:unknownError')}</p>
                    <p className="mt-4 text-sm text-center ">{t('plugin:unknownErrorDesc')}</p>
                  </>
                );
            }
          })()}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default SekundComponent;
