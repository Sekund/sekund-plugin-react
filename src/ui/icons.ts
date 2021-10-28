import { addIcon } from "obsidian";

export const icons: Record<string, string> = {
  "sekund-note": `<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 600 600" style="enable-background:new 0 0 600 600;" xml:space="preserve">
<style type="text/css">
 .st0{fill:#F4526A;}
 .st1{fill:#FFFFFF;}
</style>
<circle class="st0" cx="300" cy="300" r="300"/>
<path class="st1" d="M181.39,201.53c-54.76,0-99.15,43.39-99.15,99.15c0,69.19,57.87,100.21,90.89,100.21
 c-7.22,38.27-24.8,71.34-71.25,112.67c121.9-33.07,182.83-121.9,182.83-206.62C284.7,239.76,236.15,201.53,181.39,201.53z"/>
<path class="st1" d="M416.28,201.53c-54.76,0-99.15,43.39-99.15,99.15c0,69.19,57.87,100.21,90.89,100.21
 c-7.22,38.27-24.8,71.34-71.25,112.67c121.9-33.07,182.83-121.9,182.83-206.62C519.59,239.76,471.04,201.53,416.28,201.53z"/>
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
