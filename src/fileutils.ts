import { DataAdapter, normalizePath } from "obsidian";

export async function mkdirs(path: string, fsAdapter: DataAdapter) {
  path = normalizePath(path);
  let directories = ".";
  for (const dir of path.split("/")) {
    directories = `${directories}/${dir}`;
    const dirExists = await fsAdapter.exists(normalizePath(directories));
    if (!dirExists) {
      await fsAdapter.mkdir(directories);
    }
  }
}
