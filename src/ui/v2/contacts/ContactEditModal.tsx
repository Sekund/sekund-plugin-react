/* This example requires Tailwind CSS v2.0+ */
import { People } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import { GlobeAltIcon, XIcon } from "@heroicons/react/solid";
import { LinkedIn, Twitter } from "@mui/icons-material";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  closeDialog: () => void;
  person: People;
};

export default function ContactDisplayModal({ closeDialog, person: people }: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const shade = useRef<any>();

  return (
    <div
      ref={shade}
      onClick={(evt) => {
        if (evt.target === shade.current) {
          closeDialog();
        }
      }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-obs-cover"
    >
      <div className="relative inline-block w-full h-full p-6 px-4 pt-5 pb-4 text-left sm:my-8 bg-obs-primary">
        <div className="absolute top-0 right-0 pt-4 pr-4 sm:block">
          <div
            className="flex flex-col justify-center rounded-md cursor-pointer bg-primary hover:text-obs-muted focus:outline-none"
            onClick={() => closeDialog()}
          >
            <span className="sr-only">{t("close")}</span>
            <XIcon className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
        <>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mx-4">
              <div className="flex justify-center">{peopleAvatar(people, 24)}</div>
              <div className="mt-2 text-sm text-secondary">
                <p className="text-xl">{people.name || people.email}</p>
              </div>
              {people.personalPage ? (
                <dl>
                  <dt className="flex items-center space-x-1">
                    <GlobeAltIcon className="w-4 h-4" />
                    <span>Personal page</span>
                  </dt>
                  <dd>
                    <a href={people.personalPage}>{people.personalPage}</a>
                  </dd>
                </dl>
              ) : null}
              {people.twitterHandle ? (
                <dl>
                  <dt className="flex items-center space-x-1">
                    <Twitter className="w-4 h-4" /> <span>Twitter</span>
                  </dt>
                  <dd>
                    <a href={`https://twitter.com/${people.twitterHandle}`}>{people.twitterHandle}</a>
                  </dd>
                </dl>
              ) : null}
              {people.linkedInPage ? (
                <dl>
                  <dt className="flex items-center space-x-1">
                    <LinkedIn className="w-4 h-4" /> <span>LinkedIn</span>
                  </dt>
                  <dd style={{ maxWidth: "10rem" }}>
                    <a className="truncate overflow-clip" href={people.linkedInPage}>
                      {people.linkedInPage}
                    </a>
                  </dd>
                </dl>
              ) : null}
              {people.linkedInPage ? (
                <dl>
                  <dt className="flex items-center">Bio</dt>
                  <dd>{people.bio}</dd>
                </dl>
              ) : null}
            </div>

            <div className="flex items-center justify-center w-full h-full space-x-2">
              <button className="mr-0 md-cta">Remove from contacts</button>
              <button className="mr-0 md-cta">Ban</button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
