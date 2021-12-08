export default class ApiKeyService {
  constructor(private user: Realm.User, private subdomain: string) {}

  async ensureApiKey() {
    // first ensure we have a valid API key

    let apiKey = await this.getApiKey();
    apiKey = apiKey ? apiKey : await this.createApiKey();

    return apiKey;
  }

  async getApiKey() {
    const atlasApiKeys = this.user.mongoClient("mongodb-atlas").db(this.subdomain).collection("apiKeys");
    return atlasApiKeys.findOne({});
  }

  async createApiKey() {
    const newKey = await this.user.apiKeys.create("apiKey_" + new Date().getTime());
    let atlasApiKeys = this.user.mongoClient("mongodb-atlas").db(this.subdomain).collection("apiKeys");
    if (atlasApiKeys && newKey) {
      const { key, name, disabled } = newKey;
      const keyToInsert = { key, name, disabled, jwtId: this.user.id };
      await atlasApiKeys.insertOne(keyToInsert);
      return key;
    }
    return null;
  }

  async getApiKeys(): Promise<any[] | undefined> {
    return await this.user.apiKeys.fetchAll();
  }

  // export async function fetchApiKey(apiKeyID: string) {
  //   return await app.currentUser?.apiKeys.fetch(apiKeyID);
  // }

  async deleteApiKey(apiKeyId: any) {
    return await this.user.apiKeys.delete(apiKeyId);
  }

  async deleteAllApiKeys() {
    const apiKeys = await this.getApiKeys();
    if (!apiKeys) {
      return;
    }
    apiKeys.forEach(async (key) => {
      await this.deleteApiKey(key._id);
    });
  }
}
