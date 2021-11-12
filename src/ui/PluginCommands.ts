import i18next from "@/i18n.config";
import { NOTE_VIEW_TYPE, HOME_VIEW_TYPE, PEOPLES_VIEW_TYPE, GROUPS_VIEW_TYPE, MAIN_VIEW_TYPE } from "@/_constants";
import ThePlugin from "../main";
import { GenericFuzzySuggester, SuggesterItem } from "./GenericFuzzySuggester";

/**
 *
 */

export default class PluginCommands {
	plugin: ThePlugin;

	sekundCommands = [
		{
			id: "sekund-open-note-view",
			icon: "sekund-icon",
			name: i18next.t("plugin:openChatView"),
			showInRibbon: true,
			callback: async () => {
				await this.plugin.showPane(NOTE_VIEW_TYPE);
			},
		},
		{
			id: "sekund-open-home-view",
			icon: "sekund-icon",
			name: i18next.t("plugin:openHomeView"),
			showInRibbon: true,
			callback: async () => {
				await this.plugin.showPane(HOME_VIEW_TYPE);
			},
		},
		{
			id: "sekund-open-peoples-view",
			icon: "sekund-icon",
			name: i18next.t("plugin:openPeoplesView"),
			showInRibbon: true,
			callback: async () => {
				await this.plugin.showPane(PEOPLES_VIEW_TYPE);
			},
		},
		{
			id: "sekund-open-groups-view",
			icon: "sekund-icon",
			name: i18next.t("plugin:openGroupsView"),
			showInRibbon: true,
			callback: async () => {
				await this.plugin.showPane(GROUPS_VIEW_TYPE);
			},
		},
		{
			id: "sekund-open-all-views",
			icon: "sekund-icon",
			name: i18next.t("plugin:openAllViews"),
			showInRibbon: true,
			callback: async () => {
				[HOME_VIEW_TYPE, NOTE_VIEW_TYPE, PEOPLES_VIEW_TYPE, GROUPS_VIEW_TYPE].forEach((t) => this.plugin.showPane(t));
			},
		},
		{
			id: "sekund-open-tabs-view",
			icon: "sekund-icon",
			name: "Open Main View",
			showInRibbon: true,
			callback: async () => {
				await this.plugin.showPane(MAIN_VIEW_TYPE);
			},
		},
	];

	async ribbonDisplayCommands(): Promise<void> {
		const sekundCommandList: SuggesterItem[] = [];
		this.sekundCommands.forEach((cmd) => {
			if (cmd.showInRibbon) sekundCommandList.push({ display: cmd.name, info: cmd.callback });
		});
		const gfs = new GenericFuzzySuggester(this.plugin);
		gfs.setSuggesterData(sekundCommandList);
		await gfs.display(async (results) => await results.info());
	}

	constructor(plugin: ThePlugin) {
		this.plugin = plugin;

		this.sekundCommands.forEach(async (item) => {
			this.plugin.addCommand({
				id: item.id,
				name: item.name,
				callback: async () => {
					await item.callback();
				},
			});
		});
	}
}
