import "obsidian";

type FSEvent = "file-open" | "modify" | "rename";

declare module "obsidian" {
  interface Workspace {
    on(name: FSEvent, callback: (file: TFile) => Promise<void>): EventRef;
  }

  interface Vault {
    on(name: FSEvent, callback: (file: TFile) => Promise<void>): EventRef;
  }

  interface MarkdownPostProcessorContext {
    containerEl?: HTMLElement;
  }

  interface MetadataCache {
    on(name: "dataview:metadata-change", callback: (...args: [op: "rename", file: TAbstractFile, oldPath: string] | [op: "delete", file: TFile] | [op: "update", file: TFile]) => unknown, ctx?: unknown): EventRef;
  }
}
