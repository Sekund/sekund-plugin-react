import { EventRef, Plugin, TFolder, WorkspaceLeaf, Command, Notice } from 'obsidian';
import { COLLAPSE_ALL_ICON, EXPAND_ALL_ICON } from './constants';
import { FileExplorerItem } from './interfaces';

export class CollapseAllPlugin extends Plugin {
  async onload(): Promise<void> {
    // Initialize
    this.app.workspace.onLayoutReady(() => {
      const explorers = this.getFileExplorers();
      explorers.forEach((exp) => {
        this.addCollapseButton(exp);
      });
    });

    // File explorers that get opened later on
    this.registerEvent(
      this.app.workspace.on('layout-change', () => {
        const explorers = this.getFileExplorers();
        explorers.forEach((exp) => {
          this.addCollapseButton(exp);
        });
      })
    );
  }

  onunload(): void {
    // Remove all collapse buttons
    const explorers = this.getFileExplorers();
    explorers.forEach((exp) => {
      this.removeCollapseButton(exp);
    });
  }

  /**
   * Adds the collapse button to a file explorer leaf.
   * Returns the newly created button element or the old one if already there.
   */
  private addCollapseButton(explorer: WorkspaceLeaf): void {
    const container = explorer.view.containerEl as HTMLDivElement;
    const navContainer = container.querySelector(
      'div.nav-buttons-container'
    ) as HTMLDivElement;
    if (!navContainer) {
      return null;
    }

    const existingButton = this.getCollapseButton(explorer);
    if (existingButton) {
      return;
    }

    const newIcon = document.createElement('div');
    this.updateButtonIcon(explorer, newIcon);
    newIcon.className = 'nav-action-button collapse-all-plugin-button';
    this.registerDomEvent(newIcon, 'click', () => {
      this.onButtonClick(explorer);
    });
    navContainer.appendChild(newIcon);

    // Register click handler on explorer to toggle button icon
    const handler = () => {
      this.updateButtonIcon(explorer, newIcon);
    };
    explorer.view.containerEl.on('click', '.nav-folder-title', handler);
    this.register(() => {
      explorer.view.containerEl.off('click', '.nav-folder-title', handler);
    });
  }

  /**
   * Remove the collapse button from a given file explorer leaf.
   */
  private removeCollapseButton(explorer: WorkspaceLeaf): void {
    const button = this.getCollapseButton(explorer);
    if (button) {
      button.remove();
    }
  }

  /**
   * Reveal the active file in the given file explorer
   */
  private onButtonClick(explorer: WorkspaceLeaf): void {
    if (explorer) {
      //@ts-ignore
      this.app.commands.executeCommandById('file-explorer:reveal-active-file');
    }
  }

  /**
   * Update icon for given explorer/button to collapse/expand all.
   * Providing the forceAllCollapsed parameter will skip checking and assume that state
   */
  private updateButtonIcon(
    explorer: WorkspaceLeaf,
    button?: HTMLElement,
    forceAllCollapsed?: boolean
  ): void {
    if (!button) {
      button = this.getCollapseButton(explorer);
    }
    if (button) {
      button.innerHTML = forceAllCollapsed
        ? EXPAND_ALL_ICON
        : COLLAPSE_ALL_ICON;
      button.setAttribute(
        'aria-label',
        forceAllCollapsed ? 'Expand all' : 'Collapse all'
      );
    }
  }

  /**
   * Returns all loaded file explorer leaves
   */
  private getFileExplorers(): WorkspaceLeaf[] {
    return this.app.workspace.getLeavesOfType('file-explorer');
  }

  /**
   * Get the collapse button for a given file explorer, if it exists
   */
  private getCollapseButton(explorer: WorkspaceLeaf): HTMLDivElement | null {
    return explorer.view.containerEl.querySelector(
      '.collapse-all-plugin-button'
    );
  }

  /**
   * Get all `fileItems` on explorer view. This property is not documented.
   */
  private getExplorerItems(explorer: WorkspaceLeaf): FileExplorerItem[] {
    return Object.values(
      (explorer.view as any).fileItems
    ) as FileExplorerItem[];
  }

  /**
   * Ensures given explorer item is a folder and not the root or a note
   */
  private explorerItemIsFolder(item: FileExplorerItem): boolean {
    return (
      item.file instanceof TFolder &&
      item.file.path !== '/' &&
      item.collapsed !== undefined
    );
  }

  /**
   * Returns true if every folder in the given items (files and folders) is collapsed
   */
  private foldersAreCollapsed(items: FileExplorerItem[]): boolean {
    return items.every(
      (i) => !this.explorerItemIsFolder(i) || i.collapsed === true
    );
  }
}
