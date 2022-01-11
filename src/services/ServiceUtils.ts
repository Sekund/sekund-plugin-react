import SekundPluginReact from "@/main";

export function spread(args?: Array<any>) {
  return args ? { ...args } : undefined;
}

export async function callFunction(plugin: SekundPluginReact, fnName: string, args?: Array<any>): Promise<any> {
  if (!args || args.length === 0) {
    return await plugin.user.callFunction(fnName);
  } else {
    return await plugin.user.callFunction(fnName, ...args);
  }
}
