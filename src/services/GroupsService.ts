import { Group } from "@/domain/Group";
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

	async upsertGroup(group: Group): Promise<Group> {
		(group as any).peoples = group.peoples.map((g) => g._id);
		const result: any = await callFunction(this.plugin, "upsertGroup", [group]);
		console.log("upserted group, result", result);
		return result[0];
	}
}
