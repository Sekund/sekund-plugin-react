import { peopleAvatar } from "@/helpers/avatars";
import { callFunction } from "@/services/ServiceUtils";
import UsersService from "@/services/UsersService";
import { useAppContext } from "@/state/AppContext";
import { CogIcon, UserCircleIcon, XIcon } from "@heroicons/react/solid";
import { encode } from "base64-arraybuffer";
import ObjectID from "bson-objectid";
import mime from "mime-types";
import React, { KeyboardEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  close: () => void;
};

type State = {
  avatarImage: string | undefined;
  name: string | undefined;
  bio: string | undefined;
  edit: {
    avatar: boolean;
    bio: boolean;
    name: boolean;
  };
};

export default function SekundSettings({ close }: Props) {
  const { appState } = useAppContext();
  const userProfile = useRef(appState.userProfile);
  const { t } = useTranslation();
  const nameField = useRef<any>();
  const bioArea = useRef<any>();
  const fileInput = useRef<any>();

  const [state, setState] = useState<State>({
    avatarImage: userProfile.current.image,
    name: userProfile.current.name,
    bio: userProfile.current.bio,
    edit: {
      avatar: false,
      bio: false,
      name: false,
    },
  });

  function about() {
    appState.plugin?.about();
  }

  async function saveAvatarImage(o: any) {
    const fr = new FileReader();
    const file = fileInput.current.files[0];
    fr.readAsArrayBuffer(file);
    fr.onload = async () => {
      if (fr.result) {
        const buffer: ArrayBuffer = fr.result as ArrayBuffer;
        const base64 = encode(buffer);
        const mimeType = mime.lookup(file.name);
        const avatarImage = `avatars/${userProfile.current._id.toString()}/${file.name}`;
        if (appState.plugin) {
          await callFunction(appState.plugin, "upload", [base64, avatarImage, mimeType, true]);
          const edit = { ...state.edit, avatar: false };
          const workspaceName = appState.plugin.subdomain;
          setState({ ...state, avatarImage: `https://sekund-${workspaceName}-assets.s3.amazonaws.com/${avatarImage}`, edit });
          userProfile.current.image = `https://sekund-${workspaceName}-assets.s3.amazonaws.com/${avatarImage}`;
          UsersService.instance.saveUser(userProfile.current);
        }
      }
    };
  }

  function saveName(evt: KeyboardEvent) {
    if (evt.code === "Enter") {
      saveNameValue();
    }
  }

  async function saveNameValue() {
    if (nameField.current.value === userProfile.current.name) {
      setState({ ...state, edit: { ...state.edit, name: false } });
      return;
    }
    const nameTaken = await UsersService.instance.isNameTaken(nameField.current.value);
    if (nameTaken) {
      alert(t("nameAlreadyTaken"));
      return;
    }
    const edit = { ...state.edit, name: false };
    userProfile.current.name = nameField.current.value;
    UsersService.instance.saveUser(userProfile.current);
    setState({ ...state, name: nameField.current.value, edit });
  }

  function saveBio(evt: KeyboardEvent) {
    if (evt.code === "Enter") {
      saveBioValue();
    }
  }

  async function saveBioValue() {
    const edit = { ...state.edit, bio: false };
    userProfile.current.bio = bioArea.current.value;
    UsersService.instance.saveUser(userProfile.current);
    setState({ ...state, bio: bioArea.current.value, edit });
  }

  function editField(field: string, b: boolean) {
    const edit = { ...state.edit };
    edit[field] = b;
    setState({ ...state, edit });
  }

  function disconnect() {
    appState.plugin?.disconnect();
  }

  const SectionButton = ({ field }: { field: "avatar" | "bio" | "name" }) => {
    if (state.edit[field]) {
      return (
        <button className="mr-0" onClick={() => editField(field, false)}>
          {t("cancel")}
        </button>
      );
    } else {
      let label: string;
      switch (field) {
        case "avatar":
          label = state.avatarImage ? t("edit") : t("add");
          break;
        case "name":
          label = state.name ? t("edit") : t("add");
          break;
        case "bio":
          label = state.bio ? t("edit") : t("add");
          break;
      }
      return (
        <button className="mr-0" onClick={() => editField(field, true)}>
          {label}
        </button>
      );
    }
  };

  const UploadWidget = () => {
    if (state.edit.avatar) {
      return (
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          <label className="flex flex-col items-center bg-blue-500 border rounded-md cursor-pointer">
            <span className="text-base leading-normal truncate" style={{ padding: "6px 20px" }}>
              {t("selectAnImage")}
            </span>
            <input ref={fileInput} type="file" onChange={saveAvatarImage} className="hidden" />
          </label>
        </div>
      );
    }
    return null;
  };

  const Name = () => {
    if (state.edit.name) {
      return (
        <div className="flex justify-center space-x-2 f-full">
          <input ref={nameField} type="text" onKeyPress={saveName} defaultValue={state.name || ""} placeholder={t("name")} />
          <button className="mr-0 capitalize" onClick={saveNameValue}>
            {t("save")} ⏎
          </button>
        </div>
      );
    }
    return <div className="inline-block">{state.name}</div>;
  };

  const Bio = () => {
    if (state.edit.bio) {
      return (
        <div className="flex flex-col space-y-2" style={{ minWidth: "250px", maxWidth: "300px" }}>
          <textarea ref={bioArea} spellCheck="false" rows={3} onKeyPress={saveBio} defaultValue={state.bio || ""} />
          <div className="flex justify-end">
            <button className="mr-0 capitalize flex-end" onClick={saveBioValue}>
              {t("save")} ⏎
            </button>
          </div>
        </div>
      );
    }
    return <div className="inline-block">{state.bio}</div>;
  };

  return (
    <>
      <div className="flex flex-col w-full px-2 mt-1">
        <div className="relative flex justify-center py-1 space-x-1 text-lg text-obs-muted">
          <CogIcon className="w-6 h-6" />
          <span className="capitalize">{t("settings")}</span>
          <XIcon className="absolute w-6 h-6 cursor-pointer right-1 top-1" onClick={close} />
        </div>
        <section className="p-2 mt-4 hover:bg-obs-secondary">
          <div className="flex justify-between">
            <div className="text-lg capitalize">{t("avatar")}</div>
            <SectionButton field="avatar" />
          </div>
          <div className="relative w-full text-center">
            {state.avatarImage ? (
              <div className="inline-block">
                {peopleAvatar(
                  {
                    _id: new ObjectID(),
                    name: state.name,
                    image: state.avatarImage,
                  },
                  24
                )}
              </div>
            ) : (
              <>
                <UserCircleIcon className="inline-block w-24 h-24" />
              </>
            )}
            <UploadWidget />
          </div>
        </section>
        <section className="p-2 mt-2 hover:bg-obs-secondary">
          <div className="flex justify-between">
            <div className="text-lg">{t("username")}</div>
            <SectionButton field="name" />
          </div>
          {(state.name && state.name.length > 0) || state.edit.name ? (
            <div className="flex justify-center py-2">
              <Name />
            </div>
          ) : (
            <div className="w-full py-2 text-center text-obs-muted">{t("introduceYourself")}</div>
          )}
        </section>
        <section className="p-2 mt-2 hover:bg-obs-secondary">
          <div className="flex justify-between">
            <div className="text-lg capitalize">{t("bio")}</div>
            <SectionButton field="bio" />
          </div>
          {(state.bio && state.bio.length > 0) || state.edit.bio ? (
            <div className="flex justify-center py-2">
              <Bio />
            </div>
          ) : (
            <div className="w-full py-2 text-center text-obs-muted">{t("describeYourself")}</div>
          )}
        </section>
        <section className="p-2 mt-2 mb-8 hover:bg-obs-secondary">
          <div className="flex justify-between">
            <div className="flex">
              <div className="text-lg capitalize">{t("account")}</div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-2">
            <div className="text-sm">
              <span>{t("workspace")}</span>: <span className="text-obs-accent">{appState.plugin?.subdomain}</span>
            </div>
            <div className="text-sm text-obs-muted">{userProfile.current.email}</div>
          </div>
          <div className="flex flex-col items-center justify-center mt-3 space-y-4">
            <button className="w-48 mr-0 text-center" onClick={disconnect}>
              {t("disconnect")}
            </button>
            {/* <button className="w-48 mr-0 text-center text-red-500 bg-red-100">{t("deleteAllData")}</button> */}
          </div>
        </section>
        <section className="text-center">
          <a onClick={about}>{t("about")}</a>
        </section>
      </div>
    </>
  );
}
