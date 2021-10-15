import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { addIcons } from "@/ui/icons";
import SekundView from "@/ui/SekundView";
import { VIEW_TYPE } from "@/_constants";

interface SekundPluginSettings {
  apiKey: string;
  subdomain: string;
}

const DEFAULT_SETTINGS: SekundPluginSettings = {
  apiKey: "",
  subdomain: "",
};

interface ReactComponentsSettings {
  template_folder: string;
  auto_refresh: boolean;
}

export default class SekundPluginReact extends Plugin {

  settings: SekundPluginSettings;
  view: SekundView;

  async onload() {
    await this.loadSettings();
    addIcons();

    this.registerView(VIEW_TYPE, (leaf) => {
      this.view = new SekundView(leaf, this);
      return this.view;
    });

    this.addCommand({
      id: "sekund-open-view",
      name: "Open Sekund View",
      callback: async () => {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length == 0) {
          await this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE,
          });
        }
        this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(VIEW_TYPE).first());
      },
    });

    this.addSettingTab(new SekundSettingsTab(this.app, this));
    this.app.workspace.onLayoutReady(async () => this.refreshPanes());
  }

  refreshPanes() {
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      if (leaf.getViewState().state.mode.includes("preview"))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (leaf.view as any).previewMode.rerender(true);
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SekundSettingsTab extends PluginSettingTab {
  plugin: SekundPluginReact;

  constructor(app: App, plugin: SekundPluginReact) {
    super(app, plugin);
    this.plugin = plugin;
  }

  hide(): void {
    this.plugin.loadSettings();
    setTimeout(() => this.plugin.view.attemptConnection(0), 100);
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Sekund API Key")
      .setDesc("To retrieve your API key, go to your Sekund Account Page -> API Key")
      .addText((text) =>
        text
          .setPlaceholder("Paste your Sekund API Key here")
          .setValue(this.plugin.settings.apiKey || "")
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Sekund subdomain")
      .setDesc("Specify your Sekund subdomain (e.g. [TEAM_NAME].sekund.io)")
      .addText((text) =>
        text
          .setPlaceholder("Subdomain")
          .setValue(this.plugin.settings.subdomain || "")
          .onChange(async (value) => {
            this.plugin.settings.subdomain = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
