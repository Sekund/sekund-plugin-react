import { Group } from "@/domain/Group";
import { ObjectId } from "bson";
import * as Realm from "realm-web";

export default class GroupsService {
  private static _instance: GroupsService;
  constructor(private user: Realm.User) {
    GroupsService._instance = this;
  }

  static get instance() {
    return GroupsService._instance;
  }

  async fetchGroup(groupId: string) {
    const result: any = await this.user.functions.getGroup(groupId);
    return result[0];
  }

  async deleteGroup(groupId: ObjectId) {
    const result: any = await this.user.functions.deleteGroup(groupId);
    return result;
  }

  async upsertGroup(group: Group): Promise<Group> {
    (group as any).peoples = group.peoples.map((g) => g._id);
    const result: any = await this.user.functions.upsertGroup(group);
    return result[0];
  }
}
