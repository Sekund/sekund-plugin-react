// i18next.config.js
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/common.json";
import fr from "./locales/fr/common.json";

import pluginEn from "./locales/en/plugin.json";
import pluginFr from "./locales/fr/plugin.json";

i18next
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    react: {
      useSuspense: false,
    },
    resources: {
      en: { common: en, plugin: pluginEn },
      fr: { common: fr, plugin: pluginFr },
    },
    ns: ["common", "plugin"],
    defaultNS: "common",
  });

export default i18next;
