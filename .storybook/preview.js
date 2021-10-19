import { i18next } from "./i18next.js";
import { I18nextProvider } from "react-i18next";
import { addDecorator } from "@storybook/react";

addDecorator((storyFn) => <I18nextProvider i18n={i18next}>{storyFn()}</I18nextProvider>);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  i18next,
  locale: "en",
  locales: {
    en: "English",
    fr: "Français",
  },
  darkMode: {
    stylePreview: true,
    darkClass: "theme-dark",
    lightClass: "theme-light",
  },
  viewport: {
    viewports: {
      verticalTab: {
        name: "Obsidian Vertical Tab",
        styles: {
          width: "300px",
          height: "100%",
        },
      },
    },
  },
};
export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", right: "🇺🇸", title: "English" },
        { value: "fr", right: "🇫🇷", title: "French" },
        { value: "nl", right: "🇳🇱", title: "Dutch" },
        { value: "es", right: "🇪🇸", title: "Spanish" },
        { value: "de", right: "🇩🇪", title: "German" },
        { value: "it", right: "🇮🇹", title: "Italian" },
        { value: "pt", right: "🇵🇹", title: "Portuguese" },
        { value: "ru", right: "🇷🇺", title: "Russian" },
      ],
    },
  },
};
