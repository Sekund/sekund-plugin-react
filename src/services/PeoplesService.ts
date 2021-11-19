import { Note } from "@/domain/Note";
import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { callFunction } from "@/services/ServiceUtils";
import ObjectID from "bson-objectid";
import { Group } from "../domain/Group";
import { People } from "../domain/People";

export default class PeoplesService extends ServerlessService {
  private static _instance: PeoplesService;
  private totalUnread: number = 0;

  constructor(plugin: SekundPluginReact) {
    super(plugin);
    PeoplesService._instance = this;
  }

  static get instance() {
    return PeoplesService._instance;
  }

  async getUserGroups(): Promise<Group[]> {
    return callFunction(this.plugin, "getGroups");
  }

  async getUserNetworkStats(): Promise<{ nPeoples: number; nGroups: number }> {
    return { nPeoples: (await this.getRawPeoples()).length, nGroups: (await this.getUserGroups()).length };
  }

  async getRawPeoples(): Promise<People[]> {
    const { sharingNotes, sharedNotes } = await callFunction(this.plugin, "peoples");

    const sharing: Array<{ sharing: { peoples: ObjectID[] }; isRead: number; updated: number }> = sharingNotes;
    const shared: Array<{ userId: ObjectID; isRead: number; updated: number }> = sharedNotes;

    const peoples: Array<People> = [];

    const getPeople = (id: ObjectID): Partial<People | null> => {
      const found = peoples.filter((p) => p._id.equals(id));
      return found.length > 0 ? found[0] : null;
    };

    sharing.forEach((note) => {
      const isUnread = note.isRead && note.isRead < note.updated;
      if (isUnread) {
        this.totalUnread += 1;
      }
      note.sharing?.peoples?.forEach((userId) => {
        if (getPeople(userId) === null) {
          peoples.push({
            _id: userId,
            sharing: 1,
            unreadSharing: isUnread ? 1 : 0,
          } as People);
        } else {
          const people = getPeople(userId);
          if (people && people.sharing) {
            people.sharing += 1;
          }
        }
      });
    });

    shared.forEach((note) => {
      const isUnread = note.isRead && note.isRead < note.updated;
      if (isUnread) {
        this.totalUnread += 1;
      }
      if (note.userId) {
        if (getPeople(note.userId) === null) {
          peoples.push({
            _id: note.userId,
            shared: 1,
            unreadShared: isUnread ? 1 : 0,
          } as People);
        } else {
          const people = getPeople(note.userId);
          if (people) {
            if (people.shared) {
              people.shared += 1;
            } else {
              people.shared = 1;
            }
            if (isUnread) {
              if (people.unreadShared) {
                people.unreadShared += 1;
              } else {
                people.unreadShared = 1;
              }
            }
          }
        }
      }
    });

    return peoples;
  }

  async getPeoples(): Promise<People[]> {
    const peoples: Array<People> = await this.getRawPeoples();

    const atlasUsers = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.subdomain).collection("users");
    const users = await atlasUsers?.find({ _id: { $in: peoples.map((p) => p._id) } });

    const peopleData: Array<People> = peoples.map((p) => {
      const user: { name: string; email: string; image: string; createdAt: Date; bio: string; updatedAt: Date } = users?.filter((user) =>
        user._id.equals(p._id)
      )[0];
      if (user) {
        p.createdAt = user.createdAt;
        p.updatedAt = user.updatedAt;
        p.email = user.email;
        p.image = user.image;
        p.bio = user.bio;
        p.name = user.name;
      }
      return p;
    });

    return peopleData;
  }

  async getPeople(pid: string): Promise<People> {
    const { user, sharingNotes, sharedNotes } = await callFunction(this.plugin, "people", [pid]);

    const people = {
      _id: user._id,
      name: user.name,
      image: user.image,
      email: user.email,
      bio: user.bio,
      sharing: sharingNotes.length,
      shared: sharedNotes.length,
    } as People;

    return people;
  }
}
