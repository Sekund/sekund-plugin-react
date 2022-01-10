import { People } from "@/domain/People";
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

  static get instance() {
    return PermissionsService._instance;
  }

  async getPermissions(): Promise<SharingPermission[]> {
    const permissions = await callFunction(this.plugin, "permissions");
    return permissions.map((p: any) => {
      const result = { ...p };
      if (p.user && p.user.length > 0) {
        result.user = p.user[0];
      }
      if (p.userInfo && p.userInfo.length > 0) {
        result.userInfo = p.userInfo[0];
      }
      if (p.group && p.group.length > 0) {
        result.group = p.group[0];
      }
      return result;
    });
  }

  async addContactRequest(user: People) {
    return await callFunction(this.plugin, "addContactRequest", [user]);
  }

  async setStatus(sp: SharingPermission, status: PermissionRequestStatus) {
    return await callFunction(this.plugin, "setPermissionStatus", [sp, status]);
  }
}
