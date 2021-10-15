import { i18next } from "./i18next.js";
import { I18nextProvider } from "react-i18next";
import { addDecorator } from "@storybook/react";

addDecorator((storyFn) => <I18nextProvider i18n={i18next}>{storyFn()}</I18nextProvider>);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
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
    darkClass: 'theme-dark',
    lightClass: 'theme-light'
  },
}