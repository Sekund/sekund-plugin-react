export default class ApiKeyService {
  constructor(private user: Realm.User) {}

  async ensureApiKey(vaultName: string) {
    function hashCode(str) {
      var hash = 0,
        i = 0,
        len = str.length;
      while (i < len) {
        hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
      }
      return hash;
    }

    return await this.user.apiKeys.create("apiKey_" + hashCode(vaultName));
  }
}
