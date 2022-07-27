import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { copyToClipboard } from "@/utils";
import { PUBLIC_HOST } from "@/_constants";
import { ExternalLinkIcon, XIcon, PlusIcon, ClipboardIcon, TrashIcon } from "@heroicons/react/solid";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import slugify from "slugify";

type Props = {
  className: string;
  note: Note;
};

export default function NotePublicLink({ note, className }: Props) {
  const { t } = useTranslation();
  const [hasPublicLink, setHasPublicLink] = useState<boolean>(note.hasPublicLink!!);

  async function createPublicLink() {
    await NotesService.instance.addPublicLink(note._id);
    note.hasPublicLink = true;
    setHasPublicLink(true);
  }

  async function removePublicLink() {
    await NotesService.instance.removePublicLink(note._id);
    note.hasPublicLink = false;
    setHasPublicLink(false);
  }

  const publicLink = `${PUBLIC_HOST}/${note._id}/${slugify(note.title.replace(".md", "").toLowerCase())}`;

  return (
    <div className={`${className} w-full text-sm text-secondary flex justify-center items-center space-x-2 h-full`}>
      {hasPublicLink ? (
        <div className="flex flex-col items-center justify-center mb-8 space-y-4">
          <a className="flex items-center underline" href={publicLink}>
            <span className="truncate">{t("plugin:publicLink")}</span>
            <ExternalLinkIcon className="flex-shrink-0 w-4 h-4" />
          </a>
          <div className="flex items-center">
            <button aria-label={t("copy")} className="flex items-center underline" onClick={() => copyToClipboard(publicLink)}>
              <ClipboardIcon className="flex-shrink-0 w-4 h-4" />
            </button>
            <button aria-label={t("plugin:remove")} className="flex items-center underline" onClick={() => removePublicLink()}>
              <TrashIcon className="flex-shrink-0 w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8 space-y-4">
          <button className="flex items-center mr-0 overflow-hidden" onClick={() => createPublicLink()}>
            <span className="truncate">{t("plugin:createPublicLink")}</span>
            <PlusIcon className="w-4 h-4" />
          </button>
          <div className="text-sm text-center text-obs-muted" style={{ maxWidth: "250px" }}>
            {t("publicLinkDesc")}
          </div>
        </div>
      )}
    </div>
  );
}
