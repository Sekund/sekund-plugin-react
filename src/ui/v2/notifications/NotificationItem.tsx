import { Notification } from "@/domain/Notification";
import { UpdateKey } from "@/state/NotificationsReducer";
import { ContactRequestContent, ContactRequestTitle } from "@/ui/v2/notifications/items/ContactRequestItem";
import { NoteCommentedContent, NoteCommentedTitle } from "@/ui/v2/notifications/items/NoteCommentedItem";
import { QuestionMarkCircleIcon, XIcon } from "@heroicons/react/solid";
import React from "react";

type Props = {
  notification: Notification;
};

export default function UpdateItem({ notification }: Props) {

  function close() {
    console.log("we should close this notification")
  }

  function Title() {
    switch (notification.category) {
      case "note":
        switch (notification.details.type) {
          case UpdateKey.NOTE_ADD_COMMENT:
            return <NoteCommentedTitle update={notification.details} />;
          default:
            return (
              <>
                <QuestionMarkCircleIcon className="w-4 h-4" />
                <span>Unknown note notification</span>
              </>
            );
        }
      case "contact":
        switch (notification.details.type) {
          case "request":
            return <ContactRequestTitle />
          default:
            return (
              <>
                <QuestionMarkCircleIcon className="w-4 h-4" />
                <span>Unknown contact notification</span>
              </>
            );
        }
      default:
        return (<>
          <QuestionMarkCircleIcon className="w-4 h-4" />
          <span>Unknown</span>
        </>)
    }
  }

  function Content() {
    switch (notification.category) {
      case "note":
        switch (notification.details.type) {
          case UpdateKey.NOTE_ADD_COMMENT:
            return <NoteCommentedContent noteNotification={notification} />
          default:
            return (
              <>
                <div className="flex flex-col space-y-1">
                  <div>Unknown note notification</div>
                </div>
              </>
            );
        }
      case "contact":
        switch (notification.details.type) {
          case "request":
            return <ContactRequestContent sharingPermission={notification.details.
            payload}/>
          default:
            return (
              <>
                <div className="flex flex-col space-y-1">
                  <div>Unknown contact notification</div>
                </div>
              </>
            );
        }
    }
  }
        
  return (
    <div className="flex flex-col p-2 mx-1 bg-accent-1 text-accent-4">
      <div className="border border-solid rounded-sm border-obs-modifier-border hover:scale-5 hover:bg-slate-300">
        <div className="flex items-center justify-between p-1 text-sm rounded-sm rounded-b-none bg-obs-modifier-border text-accent-3">
          <div className="flex items-center space-x-3">
            <Title />
          </div>
          <XIcon className="w-4 h-4 cursor-pointer" onClick={close} />
        </div>
        <div className="flex align-top">
          <div className="px-1 mt-1">
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
}
