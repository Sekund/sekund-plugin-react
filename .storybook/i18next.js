import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';

const supportedLngs = ["en", "fr", "es", "nl"];

i18next
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    react: {
      useSuspense: false,
    },
    "language": "en",
    crossDomain: true,
    requestOptions: { // used for fetch, can also be a function (payload) => ({ method: 'GET' })
      mode: 'cors',
      credentials: 'same-origin',
      cache: 'default'
    },

    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      addPath: 'locales/{{lng}}/{{ns}}.missing.json',
    },
    ns: ["common"],
    defaultNS: "common",
  });

supportedLngs.forEach((lang) => {
  ["common"].forEach((n) => {
    i18next.addResources(lang, n, require(`../public/locales/${lang}/${n}.json`));
  });
});

export { i18next };
