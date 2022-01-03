import { People, PeopleId } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import ObjectID from "bson-objectid";
import { callFunction } from "@/services/ServiceUtils";
import ServerlessService from "@/services/ServerlessService";
import SekundPluginReact from "@/main";

export default class UsersService extends ServerlessService {
  private static _instance: UsersService;
  private usersCache: { [key: string]: PeopleId } = {};
  private watching = false;
  private resumeToken: any;

  constructor(plugin: SekundPluginReact) {
    super(plugin);
    UsersService._instance = this;
    (async () => {
      await this.populateUsersCache();
      this.watchEvents();
    })();
  }

  public async watchEvents() {
    if (this.watching) {
      return;
    }
    const events = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.settings.subdomain).collection("users");
    if (events) {
      try {
        const cursor = this.resumeToken ? events.watch({ resumeAfter: this.resumeToken }) : events.watch();
        for await (const change of cursor) {
          this.resumeToken = change._id;
          this.populateUsersCache();
          console.log("done reloading all users");
        }
        this.watching = true;
      } catch (err) {
        this.watching = false;
        setTimeout(this.watchEvents, 5000);
        console.log("error watching users", err);
      }
    }
  }

  private async populateUsersCache() {
    const allUsers: PeopleId[] = await callFunction(this.plugin, "getUserInfos");
    this.usersCache = {};
    for (const p of allUsers) {
      this.usersCache[p._id.toString()] = p;
    }
  }

  static get instance() {
    return UsersService._instance;
  }

  getUserInfo(userId: string): PeopleId {
    return this.usersCache[userId];
  }

  async getWhitelistedUsersAndGroups(userIds: ObjectID[]): Promise<SelectOption[]> {
    const found: { users: any[]; groups: any[] } = (await callFunction(this.plugin, "whitelistedUsersAndGroups", [userIds])) || {};
    return found.users
      .map((user) => ({ label: user.name || user.email, value: { ...user, id: user._id.toString(), type: "user" } }))
      .concat(found.groups.map((group) => ({ label: `${group.name}`, value: { ...group, id: group._id.toString(), type: "group" } })));
  }

  async findUserByNameOrEmail(nameOrEmail: string): Promise<People> {
    return await callFunction(this.plugin, "findUserByNameOrEmail", [nameOrEmail]);
  }

  async fetchUser(): Promise<Record<string, unknown> | undefined> {
    const atlasUsers = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.subdomain).collection("users");
    if (atlasUsers) {
      const found = await atlasUsers.findOne({ _id: new ObjectID(this.plugin.user.customData._id as string) });
      return found;
    }
    return undefined;
  }

  async saveUser(p: People) {
    const atlasUsers = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.subdomain).collection("users");
    const pNonNullValues = Object.entries(p).reduce((a: any, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
    if (atlasUsers) {
      await atlasUsers.updateOne({ _id: new ObjectID(this.plugin.user.customData._id as string) }, { $set: { ...pNonNullValues } }, { upsert: true });
    }
  }
}
