import SekundPluginReact from "@/main";

export default abstract class ServerlessService {
  protected plugin: SekundPluginReact;

  constructor(p: SekundPluginReact) {
    this.plugin = p;
  }
}
