import React from 'react'
import i18nConf from '@/i18n.config';
import { useTranslation } from "react-i18next";

export default function APIInfo() {

    const { t, i18n, ready } = useTranslation([
        "common", "plugin"
    ], { i18n: i18nConf });

    return (
        <div className="flex flex-col p-2 mt-2 space-y-2 text-left border rounded-md border-obs-modal" >
            <div className="text-obs-muted">{t('plugin:subdomain')}</div>
            <input type="text" placeholder={t('plugin:subdomain')} />
            <div className="text-obs-muted">{t('plugin:APIKey')}</div>
            <input type="text" placeholder={t('plugin:APIKey')} />
            <button className="mt-2 text-center">{t('plugin:Connect')}</button>
            {/* <div className="flex flex-col justify-center space-y-2">
                <div className="text-center text-obs-muted">or</div>
                <select className="dropdown"></select>
            </div> */}
        </div>)

}
