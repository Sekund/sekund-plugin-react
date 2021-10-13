import { addIcon } from "obsidian";

export const icons: Record<string, string> = {
  sekund: `<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
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
};

export const addIcons = (): void => {
  Object.keys(icons).forEach((key) => {
    addIcon(key, icons[key]);
  });
};
