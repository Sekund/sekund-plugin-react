import SekundPluginReact from "@/main";

export function spread(args?: Array<any>) {
  return args ? { ...args } : undefined;
}

export async function callFunction(plugin: SekundPluginReact, fnName: string, args?: Array<any>): Promise<any> {
  try {
    if (!args || args.length === 0) {
      return await plugin.user.callFunction(fnName);
    } else {
      return await plugin.user.callFunction(fnName, ...args);
    }
  } catch (err) {
    if (typeof err === "string" && err.indexOf("invalid session") !== -1) {
      console.log("login error, trying to log in again...");
      const gState = await plugin.attemptConnection();
      if (gState === "allGood") {
        callFunction(plugin, fnName, args);
      }
    }
    console.log("callFunction error", err);
  }
}
