import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import ObjectID from "bson-objectid";
import { Group } from "../domain/Group";
import { People } from "../domain/People";

export default class NotificationsService extends ServerlessService {
  private static _instance: NotificationsService;

  constructor(plugin: SekundPluginReact) {
    super(plugin);
    NotificationsService._instance = this;
  }

  static get instance() {
    return NotificationsService._instance;
  }

  static set instance(instance: NotificationsService) {
    NotificationsService._instance = instance;
  }

  async getNotifications(): Promise<Notification[]> {
    return await callFunction(this.plugin, "getNotifications");
  }
}
