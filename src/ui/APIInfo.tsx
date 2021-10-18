import React, { useEffect, useRef } from 'react'
import i18nConf from '@/i18n.config';
import { useTranslation } from "react-i18next";
import { useAppContext } from '@/state/AppContext';

export default function APIInfo() {

    const { appState } = useAppContext();
    const subdomainField = useRef<HTMLInputElement>()
    const apiKeyField = useRef<HTMLInputElement>()

    // const settings = { apiKey: undefined, subdomain: undefined }
    const { apiKey, subdomain } = appState.plugin.settings;

    const { t, i18n, ready } = useTranslation([
        "common", "plugin"
    ], { i18n: i18nConf });

    function saveSettings() {
        if (subdomainField.current && apiKeyField.current) {
            appState.plugin.settings.subdomain = subdomainField.current.value;
            appState.plugin.settings.apiKey = apiKeyField.current.value;
            appState.plugin.saveSettings();
        }
        appState.plugin.view?.attemptConnection(0);
    }

    return (
        <div className="flex flex-col p-2 mt-2 space-y-2 text-left border rounded-md border-obs-modal" >
            <div className="text-obs-muted">{t('plugin:subdomain')}</div>
            <input ref={subdomainField} defaultValue={subdomain ? subdomain : undefined} pattern="^([a-zA-Z0-9]([-a-zA-Z0-9]{0,14}[a-zA-Z0-9])?)$" type="text" placeholder={t('plugin:subdomain')} />
            <div className="text-obs-muted">{t('plugin:APIKey')}</div>
            <input ref={apiKeyField} defaultValue={apiKey ? apiKey : undefined} type="text" placeholder={t('plugin:APIKey')} />
            <button onClick={saveSettings} className="mt-2 text-center">{t('plugin:Connect')}</button>
            {/* <div className="flex flex-col justify-center space-y-2">
                <div className="text-center text-obs-muted">or</div>
                <select className="dropdown"></select>
            </div> */}
        </div>)

}
