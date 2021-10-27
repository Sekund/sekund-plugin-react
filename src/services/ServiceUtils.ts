import SekundPluginReact from "@/main";

export function spread(args?: Array<any>) {
  return args ? { ...args } : undefined;
}

export async function callFunction(plugin: SekundPluginReact, fnName: string, args?: Array<any>): Promise<any> {
  try {
    if (!args) {
      return await plugin.user.callFunction(fnName);
    } else if (args.length === 1) {
      return await plugin.user.callFunction(fnName, args[0]);
    } else if (args.length === 2) {
      return await plugin.user.callFunction(fnName, args[0], args[1]);
    } else if (args.length === 3) {
      return await plugin.user.callFunction(fnName, args[0], args[1], args[2]);
    } else if (args.length === 4) {
      return await plugin.user.callFunction(fnName, args[0], args[1], args[2], args[3]);
    } else if (args.length === 5) {
      return await plugin.user.callFunction(fnName, args[0], args[1], args[2], args[3], args[4]);
    }
  } catch (err) {
    console.log("callFunction error, attempting connection...");
    const gState = await plugin.attemptConnection();
    if (gState === "allGood") {
      callFunction(plugin, fnName, args);
    }
  }
}
