export default class ApiKeyService {
  constructor(private user: Realm.User) {}

  async ensureApiKey(vaultName: string) {
    function hashCode(str: string) {
      var hash = 0,
        i = 0,
        len = str.length;
      while (i < len) {
        hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
      }
      return hash;
    }

    // always re-create the api key associated with this vault
    const allKeys = await this.user.apiKeys.fetchAll();
    const vaultKeys = allKeys.filter((k) => k.name === "apiKey_" + hashCode(vaultName));
    if (vaultKeys.length > 0) {
      await this.user.apiKeys.delete(vaultKeys[0]._id);
    }
    return await this.user.apiKeys.create("apiKey_" + hashCode(vaultName));
  }
}
