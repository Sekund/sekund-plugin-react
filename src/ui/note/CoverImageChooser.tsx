import { Note } from "@/domain/Note";
import NotesService from "@/services/NotesService";
import { useAppContext } from "@/state/AppContext";
import { endsWithAny } from "@/utils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

type Props = {
  note: Note;
  coverImage?: string;
  setCoverImage: (img: string) => void;
};

export default function CoverImageChooser({ note, coverImage, setCoverImage }: Props) {
  const { t } = useTranslation();
  const { appState } = useAppContext();
  const { userProfile } = appState;
  const [selectedImage, setSelectedImage] = useState<string | undefined>(coverImage);
  const [noteImages, setNoteImages] = useState<string[]>();

  function selectImage(img: string) {
    setSelectedImage(FQImage(img));
    setCoverImage(FQImage(img));
    fetchNoteImages(img);
  }

  useEffect(() => {
    fetchNoteImages(coverImage);
  }, []);

  function fetchNoteImages(img?: string) {
    (async () => {
      let nImages = await NotesService.instance.noteImages(userProfile._id.toString(), note._id.toString());
      if (nImages) {
        nImages = nImages.filter((i) => endsWithAny(i.toLowerCase(), ".jpg", ".jpeg", ".gif", ".png"));
        if (img) {
          nImages = nImages.sort((a, b) => (a === img ? 1 : -1));
        }
        setNoteImages(nImages);
      }
    })();
  }

  function FQImage(img: string) {
    return `https://sekund-sekund-dependencies.s3.amazonaws.com/${img}`;
  }

  function NoteImagesCarousel() {
    return (
      <div className="flex flex-col">
        <Carousel showThumbs={false} className="p-2 min-h-32" dynamicHeight={true} onClickItem={(index) => selectImage(noteImages![index])}>
          {noteImages?.map((image) => (
            <div className="cursor-pointer" key={image}>
              <img className={`${FQImage(image) === selectedImage ? "opacity-100" : "opacity-33"} object-contain h-32`} src={FQImage(image)} />
            </div>
          ))}
        </Carousel>
        <div className="max-w-md ml-1 text-sm text-obs-muted">{t("carouselDesc")}</div>
      </div>
    );
  }

  function EmptyCarousel() {
    return (
      <div className="flex flex-col items-center justify-center h-32">
        <div className="text-sm italic text-center text-obs-muted">{t("emptyCarousel")}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      <label className="ml-1 text-obs-muted">{t("coverImage")}</label>
      {noteImages && noteImages.length > 0 ? <NoteImagesCarousel /> : <EmptyCarousel />}
    </div>
  );
}
