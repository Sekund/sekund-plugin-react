import { ObjectId } from "bson";
import { Group } from "../domain/Group";
import { People } from "../domain/People";

export default class PeoplesService {
  private static _instance: PeoplesService;
  constructor(private user: Realm.User, private subdomain: string) {
    PeoplesService._instance = this;
  }

  static get instance() {
    return PeoplesService._instance;
  }

  async getUserGroups(): Promise<Group[]> {
    return this.user.functions.getGroups();
  }

  async getUserNetworkStats(): Promise<{ nPeoples: number; nGroups: number }> {
    return { nPeoples: (await this.getRawPeoples()).length, nGroups: (await this.getUserGroups()).length };
  }

  async getRawPeoples(): Promise<People[]> {
    const { sharingNotes, sharedNotes } = await this.user.functions.peoples();

    const sharing: Array<{ sharing: { peoples: ObjectId[] } }> = sharingNotes;
    const shared: Array<{ userId: ObjectId }> = sharedNotes;

    const peoples: Array<People> = [];

    const getPeople = (id: ObjectId): Partial<People | null> => {
      const found = peoples.filter((p) => p._id.equals(id));
      return found.length > 0 ? found[0] : null;
    };

    sharing.forEach((note) => {
      note.sharing?.peoples?.forEach((userId) => {
        if (getPeople(userId) === null) {
          peoples.push({
            _id: userId,
            sharing: 1,
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
      if (note.userId) {
        if (getPeople(note.userId) === null) {
          peoples.push({
            _id: note.userId,
            shared: 1,
          } as People);
        } else {
          const people = getPeople(note.userId);
          if (people) {
            if (people.shared) {
              people.shared += 1;
            } else {
              people.shared = 1;
            }
          }
        }
      }
    });

    return peoples;
  }

  async getPeoples(): Promise<People[]> {
    const peoples: Array<People> = await this.getRawPeoples();

    const atlasUsers = this.user.mongoClient("mongodb-atlas").db(this.subdomain).collection("users");
    const users = await atlasUsers?.find({ _id: { $in: peoples.map((p) => p._id) } });

    const peopleData: Array<People> = peoples.map((p) => {
      const user: { name: string; email: string; image: string; createdAt: Date; bio: string; updatedAt: Date } = users?.filter((user) => user._id.equals(p._id))[0];
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
    const { user, sharingNotes, sharedNotes } = await this.user.functions.people(pid);

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
