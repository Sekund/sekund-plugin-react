import { makeid } from "@/utils";

export default class ApiKeyService {
  constructor(private user: Realm.User) {}

  async ensureApiKey() {
    return await this.user.apiKeys.create("apiKey_" + makeid(12));
  }
}
