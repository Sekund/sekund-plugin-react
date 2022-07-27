import { Note } from "@/domain/Note";
import { useAppContext } from "@/state/AppContext";
import { usePrevious } from "@/ui/main/SekundMainComponent";
import NoteComments from "@/ui/note/NoteComments";
import NotePublishing from "@/ui/note/NotePublishing";
import NotePublicLink from "@/ui/note/NotePublicLink";
import NoteSharing from "@/ui/note/NoteSharing";
import { ChatAlt2Icon, LinkIcon, PaperAirplaneIcon, ShareIcon } from "@heroicons/react/solid";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  note: Note;
  view?: ViewType;
};

type ViewType = "comments" | "sharing" | "publishing" | "publicLink";
export type PublishingViewType = "publish" | "edit";

export default function NoteMetadataComponent(props: Props) {
  const { t } = useTranslation(["common", "plugin"]);
  const scrollPositions = useRef({ comments: 0, sharing: 0, publishing: 0 });
  const [viewType, setViewType] = useState<ViewType>(props.view || "comments");
  const [publishingViewType, setPublishingViewType] = useState<PublishingViewType>("publish");
  const previousView = usePrevious(viewType);
  const { appState } = useAppContext();
  const { userProfile } = appState;
  const viewRef = useRef<any>();

  function CurrentView() {
    if (previousView) {
      scrollPositions.current[previousView] = viewRef.current?.scrollTop;
    }
    setTimeout(() => {
      const savedScrollPosition = scrollPositions.current[viewType];
      viewRef.current.scrollTop = savedScrollPosition ? scrollPositions.current[viewType] : 0;
    }, 10);
    return (
      <div className="flex justify-center w-full h-full">
        <NoteComments className={`${viewType !== "comments" ? "hidden" : ""}`} note={props.note} />
        <NoteSharing className={`${viewType !== "sharing" ? "hidden" : ""}`} note={props.note} userId={userProfile._id} />
        <NotePublishing
          className={`${viewType !== "publishing" ? "hidden" : ""}`}
          viewType={publishingViewType}
          setViewType={setPublishingViewType}
          note={props.note}
        />
        <NotePublicLink className={`${viewType !== "publicLink" ? "hidden" : ""}`} note={props.note} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 grid h-full" style={{ gridTemplateRows: "auto 1fr" }}>
      <div className="flex items-center justify-between">
        <div
          onClick={() => {
            setViewType("comments");
          }}
          aria-label={t("comments")}
          className={`flex items-center px-2 mr-0 space-x-2 rounded-none text-obs-muted hover:opacity-100  ${
            viewType === "comments" ? "opacity-100" : "opacity-50"
          } cursor-pointer`}
        >
          <ChatAlt2Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center mr-2 space-x-1">
          <div
            onClick={() => {
              setViewType("sharing");
            }}
            aria-label={t("sharing")}
            className={`flex items-center rounded-none text-obs-muted hover:opacity-100 ${
              viewType === "sharing" ? "opacity-100" : "opacity-50"
            } cursor-pointer`}
          >
            <ShareIcon className="w-5 h-5" />
          </div>
          <div
            onClick={() => {
              setViewType("publicLink");
            }}
            aria-label={t("publicLink")}
            className={`flex items-center rounded-none text-obs-muted hover:opacity-100 ${
              viewType === "publicLink" ? "opacity-100" : "opacity-50"
            } cursor-pointer`}
          >
            <LinkIcon className="w-5 h-5" />
          </div>
          <div
            onClick={() => {
              setViewType("publishing");
            }}
            aria-label={t("publishing")}
            className={`flex items-center rounded-none text-obs-muted hover:opacity-100 ${
              viewType === "publishing" ? "opacity-100" : "opacity-50"
            } cursor-pointer`}
          >
            <PaperAirplaneIcon className="w-5 h-5" style={{ transform: "rotate(45deg)" }} />
          </div>
        </div>
      </div>
      <div ref={viewRef} className="overflow-auto">
        <CurrentView />
      </div>
    </div>
  );
}
