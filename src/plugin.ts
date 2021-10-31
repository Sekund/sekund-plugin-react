import { Plugin, WorkspaceLeaf} from 'obsidian';
import { MANUALLY_REVEAL_ACTIVE_FILE_ICON } from './constants';

export class CollapseAllPlugin extends Plugin {
  async onload(): Promise<void> {
    // Initialize
    this.app.workspace.onLayoutReady(() => {
      const explorers = this.getFileExplorers();
      explorers.forEach((exp) => {
        this.addRevealButton(exp);
      });
    });

    // File explorers that get opened later on
    this.registerEvent(
      this.app.workspace.on('layout-change', () => {
        const explorers = this.getFileExplorers();
        explorers.forEach((exp) => {
          this.addRevealButton(exp);
        });
      })
    );
  }

  onunload(): void {
    // Remove all collapse buttons
    const explorers = this.getFileExplorers();
    explorers.forEach((exp) => {
      this.removeRevealButton(exp);
    });
  }

  /**
   * Adds the reveal button to a file explorer leaf.
   * Returns the newly created button element or the old one if already there.
   */
  private addRevealButton(explorer: WorkspaceLeaf): void {
    const container = explorer.view.containerEl as HTMLDivElement;
    const navContainer = container.querySelector(
      'div.nav-buttons-container'
    ) as HTMLDivElement;
    if (!navContainer) {
      return null;
    }

    const existingButton = this.getRevealButton(explorer);
    if (existingButton) {
      return;
    }

    const newIcon = document.createElement('div');
    this.setButtonProperties(newIcon);
    newIcon.className = 'nav-action-button collapse-all-plugin-button';
    this.registerDomEvent(newIcon, 'click', () => {
      this.onButtonClick(explorer);
    });
    navContainer.appendChild(newIcon);
  }

  /**
   * Remove the collapse button from a given file explorer leaf.
   */
  private removeRevealButton(explorer: WorkspaceLeaf): void {
    const button = this.getRevealButton(explorer);
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

  private setButtonProperties(
      button: HTMLElement
  ): void {
    button.innerHTML = MANUALLY_REVEAL_ACTIVE_FILE_ICON;
    button.setAttribute(
        'aria-label',
        'Collapse all'
    );
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
  private getRevealButton(explorer: WorkspaceLeaf): HTMLDivElement | null {
    return explorer.view.containerEl.querySelector(
      '.collapse-all-plugin-button'
    );
  }

}
