import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import CoverImageChooser from "@/ui/note/CoverImageChooser";
import { PublishingViewType } from "@/ui/note/NoteMetadataComponent";
import { PUBLIC_HOST } from "@/_constants";
import { ArrowNarrowLeftIcon, ExclamationIcon, ExternalLinkIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import slugify from "slugify";

type Props = {
  note: Note;
  className: string;
  viewType: PublishingViewType;
  setViewType: (vt: PublishingViewType) => void;
};

export default function NotePublishing({ note, className, viewType, setViewType }: Props) {
  const { t } = useTranslation();
  const titleInput = useRef<any>();
  const subtitleArea = useRef<any>();
  const descriptionArea = useRef<any>();
  const [isPublished, setIsPublished] = useState(note.isPublished);
  const appState = useAppContext();
  const { userProfile } = appState.appState;

  function isValid() {
    return (
      note.title.length > 0 &&
      note.subtitle &&
      note.subtitle.length > 0 &&
      note.description &&
      note.description.length > 0 &&
      note.coverImage &&
      note.coverImage?.length > 0
    );
  }

  function saveCoverImage(imageUrl: string) {
    note.coverImage = imageUrl;
    NotesService.instance.updateNote(note._id, { $set: { coverImage: note.coverImage } });
  }

  function saveTitle() {
    note.title = (titleInput.current as HTMLInputElement).value;
    NotesService.instance.updateNote(note._id, { $set: { title: note.title } });
  }

  function saveSubtitle() {
    note.subtitle = (subtitleArea.current as HTMLTextAreaElement).value;
    NotesService.instance.updateNote(note._id, { $set: { subtitle: note.subtitle } });
  }

  function saveDescription() {
    note.description = (descriptionArea.current as HTMLTextAreaElement).value;
    NotesService.instance.updateNote(note._id, { $set: { description: note.description } });
  }

  async function unpublish() {
    await NotesService.instance.unpublish(note._id);
    setIsPublished(false);
  }

  async function publish() {
    if (userProfile.name === undefined || userProfile.name.length === 0) {
      alert(t("userNameRequiredForPublishing"));
      return;
    }
    if (userProfile.image === undefined || userProfile.image.length === 0) {
      alert(t("userImageRequiredForPublishing"));
      return;
    }
    await NotesService.instance.publish(note._id);
    setIsPublished(true);
  }

  function CurrentPanel() {
    return viewType === "edit" ? <MetadataEditionPanel /> : <DefaultPanel />;
  }

  const blogLink = `${PUBLIC_HOST}/blogs/${userProfile.name}/posts/${note._id.toString()}/${slugify(note.title.replace(".md", "").toLowerCase())}`;

  function DefaultPanel() {
    return (
      <div className={`${className} w-full text-sm text-secondary flex justify-center items-center space-x-2 h-full`}>
        {isPublished ? (
          <div className="flex flex-col items-center justify-center mb-8 space-y-4">
            <a className="flex items-center underline" href={blogLink}>
              <span className="truncate">{t("seePost")}</span>
              <ExternalLinkIcon className="flex-shrink-0 w-4 h-4" />
            </a>
            <button aria-label={t("plugin:remove")} className="flex items-center mr-0 underline" onClick={unpublish}>
              <TrashIcon className="flex-shrink-0 w-4 h-4" />
            </button>
            <a
              className="flex items-center"
              onClick={() => {
                setViewType("edit");
              }}
            >
              <PencilIcon className="w-4 h-4" />
              <span className="underline">{t("editMetadata")}</span>
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8 space-y-4">
            <div className="text-center text-obs-muted" style={{ maxWidth: "250px" }}>
              {t("publishDesc")}
            </div>
            {isValid() ? (
              <div className="flex flex-col items-center">
                <button className="mr-0 grow-0" onClick={publish}>
                  <span className="truncate">{t("publish")}</span>
                </button>
                <a
                  className="flex items-center mt-2 text-xs"
                  onClick={() => {
                    setViewType("edit");
                  }}
                >
                  <PencilIcon className="w-4 h-4" />
                  <span className="underline">{t("editMetadata")}</span>
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 border rounded-md border-accent-3" style={{ maxWidth: "250px" }}>
                <ExclamationIcon className="w-6 h-6" />
                <span className="italic text-center text-obs-muted">{t("editMetadataDesc")}</span>
                <button
                  className="flex items-center mr-0 overflow-hidden"
                  onClick={() => {
                    setViewType("edit");
                  }}
                >
                  <span>{t("OKletsDoIt")}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function MetadataEditionPanel() {
    return (
      <div className={`${className} flex flex-col space-y-2 max-w-lg m-3 text-sm`}>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            setViewType("publish");
          }}
        >
          <ArrowNarrowLeftIcon className="w-4 h-4" />
          <span>{t("back")}</span>
        </div>
        <CoverImageChooser note={note} setCoverImage={saveCoverImage} coverImage={note.coverImage} />
        <div className="flex flex-col space-x-1">
          <label className="ml-1 text-obs-muted">{t("title")}</label>
          <input type="text" onBlur={saveTitle} defaultValue={note.title} ref={titleInput}></input>
        </div>
        <div className="flex flex-col space-x-1">
          <label className="ml-1 text-obs-muted">{t("subtitle")}</label>
          <textarea onBlur={saveSubtitle} defaultValue={note.subtitle} spellCheck="false" rows={3} ref={subtitleArea}></textarea>
        </div>
        <div className="flex flex-col space-x-1">
          <label className="ml-1 text-obs-muted">{t("description")}</label>
          <textarea onBlur={saveDescription} defaultValue={note.description} spellCheck="false" rows={3} ref={descriptionArea}></textarea>
        </div>
        <p className="">&nbsp;</p> {/* this is just a spacer */}
      </div>
    );
  }

  return <CurrentPanel />;
}
