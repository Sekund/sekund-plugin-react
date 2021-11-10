import { addIcon } from "obsidian";

export const icons: Record<string, string> = {
	"sekund-icon": `<svg version="1.1" id="Calque_1" x="0px" y="0px" viewBox="0 0 600 600" style="enable-background:new 0 0 600 600;" xmlns="http://www.w3.org/2000/svg">
  <style type="text/css">
	.st0{fill: currentColor;}
	.st1{fill: rgba(0, 0, 0, 0);}
</style>
  <path d="M 600 300 C 600 465.685 465.685 600 300 600 C 134.315 600 0 465.685 0 300 C 0 134.315 134.315 0 300 0 C 465.685 0 600 134.315 600 300 Z M 181.39 201.53 C 126.63 201.53 82.24 244.92 82.24 300.68 C 82.24 369.87 140.11 400.89 173.13 400.89 C 165.91 439.16 148.33 472.23 101.88 513.56 C 223.78 480.49 284.71 391.66 284.71 306.94 C 284.7 239.76 236.15 201.53 181.39 201.53 Z M 416.28 201.53 C 361.52 201.53 317.13 244.92 317.13 300.68 C 317.13 369.87 375 400.89 408.02 400.89 C 400.8 439.16 383.22 472.23 336.77 513.56 C 458.67 480.49 519.6 391.66 519.6 306.94 C 519.59 239.76 471.04 201.53 416.28 201.53 Z" class="st0"/>
</svg>`,
	"sekund-note": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
</svg>
`,
	"sekund-home": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
</svg>`,
	"sekund-peoples": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
</svg>`,
	"sekund-groups": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
</svg>`,
};

export const addIcons = (): void => {
	Object.keys(icons).forEach((key) => {
		addIcon(key, icons[key]);
	});
};
