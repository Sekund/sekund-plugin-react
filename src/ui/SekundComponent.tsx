import * as React from "react";
import NotesService from "src/NotesService";
import AppContext, { useAppContext } from "src/state/AppContext";
import AppReducer, { initialAppState } from "src/state/AppReducer";
import SekundHomeComponent from "src/ui/SekundHomeComponent";
import SekundView from "src/ui/SekundView";

type Props = {
  view: SekundView;
};

const SekundComponent = ({ view }: Props) => {
  const [appState, appDispatch] = React.useReducer(AppReducer, initialAppState);
  const appProviderState = {
    appState,
    appDispatch,
  };

  // allow SekundView and NotesService to mutate the state
  view.setAppDispatch(appDispatch);
  // update the NotesService's appState whenever it gets updated
  React.useEffect(() => {
    if (NotesService.instance) {
      NotesService.instance.appState = appState;
    }
  }, [appState]);

  return (
    <AppContext.Provider value={appProviderState}>
      <div className="w-full main sekund">
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
                    <p className="text-center text-white-4">Connecting to https://{appState.subdomain}.sekund.io/</p>
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
                    <p className="text-center text-white-4">Login Error.</p>
                    <p className="mt-4 text-sm text-center text-white-3">Please check your API Key</p>
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
                    <p className="text-center text-white-4">No API Key.</p>
                    <p className="mt-4 text-sm text-center text-white-3">Sorry, you need to specify a Sekund API Key before using this plugin. Please head to your Sekund account's settings to fix that.</p>
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
                    <p className="text-center text-white-4">No Settings.</p>
                    <p className="mt-4 text-sm text-center text-white-3">Go to → Settings and specify both the ApiKey and Subdomain associated with your team/account.</p>
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
                    <p className="text-center text-white-4">Missing Subdomain.</p>
                    <p className="mt-4 text-sm text-center text-white-3">Please specify the subdomain associated with your team/account.</p>
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
                    <p className="text-center text-white-4">Sorry, we could not find your specified subdomain.</p>
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
                    <p className="text-center text-white-4">You are offline.</p>
                    <p className="mt-4 text-sm text-center text-white-3">Sekund needs an internet connection to function.</p>
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
                    <p className="text-center text-white-4">You are offline.</p>
                    <p className="mt-4 text-sm text-center text-white-3">Sekund needs an internet connection to function.</p>
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
