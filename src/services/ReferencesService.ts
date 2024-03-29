import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import GlobalState from "@/state/GlobalState";

export default class ReferencesService extends ServerlessService {
  private static _instance: ReferencesService;
  private referencesCache: Set<string>;
  private watching = false;
  private resumeToken: any;

  constructor(plugin: SekundPluginReact) {
    super(plugin);
    ReferencesService._instance = this;
    this.referencesCache = new Set<string>();
    (async () => {
      await this.populateReferencesCache();
      this.watchEvents();
    })();
  }

  static get instance() {
    return ReferencesService._instance;
  }

  static set instance(instance: ReferencesService) {
    ReferencesService._instance = instance;
  }

  private async populateReferencesCache() {
    const allNoteReferences: string[] = await callFunction(this.plugin, "getNoteReferences");
    this.referencesCache = new Set<string>();
    allNoteReferences.forEach((nr) => this.referencesCache.add(nr));
  }

  public async updateReferences() {
    const resolvedLinks = this.plugin.app.metadataCache.resolvedLinks;
    const sekundFolderPath = GlobalState.instance.appState.plugin?.settings.sekundFolderPath;
    const paths = Object.keys(resolvedLinks).filter((p) => !p.startsWith(sekundFolderPath || "__sekund__"));
    const localReferences: Set<string> = new Set<string>();
    for (const path of paths) {
      const references = resolvedLinks[path];
      const referencePaths = Object.keys(references).filter((rp) => rp.startsWith(sekundFolderPath || "__sekund__"));
      referencePaths.forEach((referencePath) => localReferences.add(referencePath));
    }
    const toDelete = [...this.referencesCache].filter((nr) => !localReferences.has(nr));
    const toAdd = [...localReferences].filter((nr) => !this.referencesCache.has(nr));
    if (toDelete.length > 0 || toAdd.length > 0) {
      await callFunction(this.plugin, "updateNoteReferences", [toAdd, toDelete]);
      this.populateReferencesCache();
    }
  }

  public async watchEvents() {
    if (this.watching) {
      return;
    }
    if (this.plugin && this.plugin.user) {
      const events = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.settings.subdomain).collection("references");
      if (events) {
        try {
          const cursor = this.resumeToken ? events.watch({ resumeAfter: this.resumeToken }) : events.watch();
          for await (const change of cursor) {
            this.resumeToken = change._id;
            this.populateReferencesCache();
            console.log("done reloading all note references");
          }
          this.watching = true;
        } catch (err) {
          this.watching = false;
          setTimeout(() => this.watchEvents(), 5000);
          console.log("error watching note references", err);
        }
      }
    }
  }
}
