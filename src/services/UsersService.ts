import { People, PeopleId } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import ObjectID from "bson-objectid";
import { callFunction } from "@/services/ServiceUtils";
import ServerlessService from "@/services/ServerlessService";
import SekundPluginReact from "@/main";

export default class UsersService extends ServerlessService {
  private static _instance: UsersService;
  private usersCache: { [key: string]: PeopleId } = {};

  constructor(plugin: SekundPluginReact) {
    super(plugin);
    UsersService._instance = this;
    (async () => {
      await this.populateUsersCache();
      this.watchEvents();
    })();
  }

  public async watchEvents() {
    const events = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.settings.subdomain).collection("users");
    if (events) {
      try {
        const cursor = events.watch();
        for await (const change of cursor) {
          console.log("user change, reloading all users...", change);
          this.populateUsersCache();
          console.log("done");
        }
      } catch (err) {
        console.log("error watching users");
      }
    }
  }

  private async populateUsersCache() {
    const allUsers: PeopleId[] = await callFunction(this.plugin, "getUserInfos");
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

  async findUsers(letters: string, userIds: ObjectID[]): Promise<SelectOption[]> {
    const found: { users: any[]; groups: any[] } = (await callFunction(this.plugin, "findUsersAndGroups", [letters, userIds])) || {};
    return found.users
      .map((user) => ({ label: user.name || user.email, value: { ...user, id: user._id.toString(), type: "user" } }))
      .concat(found.groups.map((group) => ({ label: `${group.name} (Group)`, value: { ...group, id: group._id.toString(), type: "group" } })));
  }

  async fetchUser(): Promise<Record<string, unknown> | undefined> {
    const atlasUsers = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.subdomain).collection("users");
    if (atlasUsers) {
      const found = await atlasUsers.findOne({ _id: new ObjectID(this.plugin.user.customData._id) });
      return found;
    }
    return undefined;
  }

  async saveUser(p: People) {
    const atlasUsers = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.subdomain).collection("users");
    const pNonNullValues = Object.entries(p).reduce((a: any, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
    if (atlasUsers) {
      const found = await atlasUsers.updateOne(
        { _id: new ObjectID(this.plugin.user.customData._id) },
        { $set: { ...pNonNullValues } },
        { upsert: true }
      );
    }
  }
}
