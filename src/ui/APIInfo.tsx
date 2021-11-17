import i18nConf from '../i18n.config';
import { useAppContext } from '@/state/AppContext';
import React, { useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { ExclamationIcon, TrashIcon } from '@heroicons/react/solid';

type Props = {
	teamId?: string | null;
	close?: () => void
}

export default function APIInfo({ teamId, close }: Props) {

	const { appState } = useAppContext();
	const subdomainField = useRef<any>()
	const apiKeyField = useRef<any>()
	const [adding, setAdding] = useState<boolean>(teamId === null);

	// teamId === null -> create a new ApiKey
	// undefined => use configured subdomain
	// non-null => edit

	const sd = () => {
		if (teamId === undefined) {
			return appState.plugin?.settings.subdomain || 'error';
		} else if (teamId === null) {
			return "";
		} else {
			return teamId;
		}
	}

	const [subdomain, setSubdomain] = useState(sd())

	const key = () => {
		if (teamId === undefined) {
			return appState.plugin?.settings.apiKey || 'error';
		} else if (teamId === null) {
			return "";
		} else {
			return appState.plugin?.settings.apiKeys[teamId] || 'error'
		}
	}

	const [apiKey, setApiKey] = useState(key())

	const isModal = close !== undefined;

	if (!appState.plugin) {
		return <ExclamationIcon className="w-6 h-6" />
	}

	const { t } = useTranslation([
		"common", "plugin"
	], { i18n: i18nConf });

	function saveSettings() {
		if (subdomainField.current && apiKeyField.current && appState.plugin) {
			const specifiedSubdomain = subdomainField.current.value;
			const specifiedApiKey = apiKeyField.current.value;
			if (adding) {
				appState.plugin.addApiKey(specifiedSubdomain, specifiedApiKey);
				setAdding(false);
			} else {
				appState.plugin.settings.subdomain = specifiedSubdomain;
				appState.plugin.settings.apiKey = specifiedApiKey;
				appState.plugin.saveSettings();
				appState.plugin?.attemptConnection(true);
				if (isModal) {
					close();
				}
			}
		}
	}

	async function deleteApiKey(value: string) {
		await appState.plugin?.deleteApiKey(value)
		if (isModal) {
			close();
		}
	}

	async function switchTeam(value: string) {
		if (appState.plugin) {

			setSubdomain(value);
			appState.plugin.settings.subdomain = value;
			setApiKey(appState.plugin.settings.apiKey);

			appState.plugin.saveSettings();

			subdomainField.current.value = value;
			apiKeyField.current.value = appState.plugin.settings.apiKey;

		}
	}

	function renderOtherTeams() {
		const teams = Object.keys(appState.plugin?.settings.apiKeys || {});
		if (!isModal && teams.length > 1) {
			return (
				<>
					<div className="w-full text-center">{t("or")}</div>
					<div className="w-full text-center">{t("plugin:selectAnotherTeam")}</div>
					<select defaultValue={subdomain} className="dropdown" onChange={(evt) => switchTeam(evt.target.value)}>
						{teams.map((t) =>
							<option key={t} value={t}>{t}</option>
						)}
					</select>
				</>)
		}
		return null;
	}

	return (
		<div className="flex flex-col p-2 mt-8 space-y-2 text-left border rounded-md border-obs-modal" >
			<div className="text-obs-muted">{t('plugin:teamID')}</div>
			<input ref={subdomainField} defaultValue={subdomain ? subdomain : undefined} key="subdomain" pattern="^([a-zA-Z0-9]([-a-zA-Z0-9]{0,14}[a-zA-Z0-9])?)$" type="text" placeholder={t('plugin:subdomain')} />
			<div className="text-obs-muted">{t('plugin:APIKey')}</div>
			<input ref={apiKeyField} defaultValue={apiKey ? apiKey : undefined} key="apiKey" type="text" placeholder={t('plugin:APIKey')} />
			<button onClick={saveSettings} className="m-0 mt-4 text-center mod-cta">
				{adding ? t('add') : t('plugin:Connect')}
			</button>

			{renderOtherTeams()}

			{isModal && teamId ?
				<button className="flex items-center justify-center m-0 mt-4 text-center" onClick={() => deleteApiKey(subdomain)}>
					<span>{t('delete')}</span>
					<TrashIcon className="w-4 h-4 ml-2"></TrashIcon>
				</button>
				:
				null
			}
		</div>)

}
