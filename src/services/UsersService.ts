import { People } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import { ObjectId } from "bson";

export default class UsersService {
  private static _instance: UsersService;
  constructor(private user: Realm.User, private subdomain: string) {
    UsersService._instance = this;
  }

  static get instance() {
    return UsersService._instance;
  }

  async findUsers(letters: string, userIds: ObjectId[]): Promise<SelectOption[]> {
    const found: { users: any[]; groups: any[] } = (await this.user.functions.findUsersAndGroups(letters, userIds)) || {};
    return found.users.map((user) => ({ label: user.name || user.email, value: { ...user, type: "user" } })).concat(found.groups.map((group) => ({ label: `${group.name} (Group)`, value: { ...group, type: "group" } })));
  }

  async fetchUser(): Promise<Record<string, unknown> | undefined> {
    const atlasUsers = this.user.mongoClient("mongodb-atlas").db(this.subdomain).collection("users");
    if (atlasUsers) {
      const found = await atlasUsers.findOne({ _id: new ObjectId(this.user.customData._id) });
      return found;
    }
    return undefined;
  }

  async saveUser(p: People) {
    const atlasUsers = this.user.mongoClient("mongodb-atlas").db(this.subdomain).collection("users");
    const pNonNullValues = Object.entries(p).reduce((a: any, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
    if (atlasUsers) {
      const found = await atlasUsers.updateOne({ _id: new ObjectId(this.user.customData._id) }, { $set: { ...pNonNullValues } }, { upsert: true });
    }
  }
}
