import { PermissionRequestStatus, SharingPermission } from "@/domain/SharingPermission";
import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";

export default class PermissionsService extends ServerlessService {
  private static _instance: PermissionsService;

  constructor(plugin: SekundPluginReact) {
    super(plugin);
    PermissionsService._instance = this;
  }

  async getPermissions(): Promise<SharingPermission[]> {
    return await callFunction(this.plugin, "permissions");
  }

  async setStatus(sp: SharingPermission, status: PermissionRequestStatus) {
    return await callFunction(this.plugin, "setPermissionStatus", [sp, status]);
  }

  static get instance() {
    return PermissionsService._instance;
  }
}
