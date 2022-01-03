import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const supportedLngs = ["en", "fr"];

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    react: {
      useSuspense: false,
    },
    language: "en",
    ns: ["common"],
    defaultNS: "common",
  });

supportedLngs.forEach((lang) => {
  ["common", "plugin"].forEach((n) => {
    i18next.addResources(lang, n, require(`../src/locales/${lang}/${n}.json`));
  });
});

export { i18next };
