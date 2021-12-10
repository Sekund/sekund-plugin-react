import { MAIN_VIEW_TYPE } from "@/_constants";
import ThePlugin from "../main";
import { GenericFuzzySuggester, SuggesterItem } from "./GenericFuzzySuggester";

/**
 *
 */

export default class PluginCommands {
  plugin: ThePlugin;

  sekundCommands = [
    {
      id: "sekund-open-main-view",
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
