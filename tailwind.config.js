module.exports = {
  purge: { enabled: false, content: ["**/*.tsx", "src/**/*.tsx"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "gray-4": "#2a2e3b",
        "gray-3": "#474c59",
        "gray-2": "#636976",
        "gray-1": "#828794",
        "accent-0": "#e6ccce",
        "accent-1": "#eaa3a7",
        "accent-2": "#e48991",
        "accent-3": "#dc707c",
        "accent-4": "#d55268",
        "white-1": "#d9d3d2",
        "white-2": "#e3dedd",
        "white-3": "#ebe8e6",
        "white-4": "#f4f2ef",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
