import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import { SelectOption } from "@/domain/Types";
import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import ObjectID from "bson-objectid";

export default class GroupsService extends ServerlessService {
  private static _instance: GroupsService;

  constructor(plugin: SekundPluginReact) {
    super(plugin);
    GroupsService._instance = this;
  }

  static get instance() {
    return GroupsService._instance;
  }

  async fetchGroup(groupId: string) {
    const result: any = await callFunction(this.plugin, "getGroup", [groupId]);
    return result[0];
  }

  async deleteGroup(groupId: ObjectID) {
    const result: any = await callFunction(this.plugin, "deleteGroup", [groupId]);
    return result;
  }

  async getGroupPeoples(groupId: ObjectID) {
    const result: any = await callFunction(this.plugin, "getGroupPeoples", [groupId]);
    return result;
  }

  async getConfirmedGroupOptions(userProfile: People): Promise<SelectOption[]> {
    var groupsColl = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.subdomain).collection("groups");
    const query = { peoples: userProfile._id };

    const groups = await groupsColl.find(query);

    return groups.map((g) => ({ value: { id: g._id.toString(), type: "group" }, label: g.name }));
  }

  async upsertGroup(group: Group): Promise<Group | null> {
    (group as any).peoples = group.peoples.map((g) => g._id);
    const result: any = await callFunction(this.plugin, "upsertGroup", [group]);
    if (result && result.length > 0) {
      return result[0];
    } else return null;
  }
}
