import { People } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import PermissionsService from "@/services/PermissionsService";
import UsersService from "@/services/UsersService";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  done: () => void;
  usersService?: UsersService;
  permissionsService?: PermissionsService;
};

export default function AddUser({ usersService, permissionsService, done }: Props) {
  const { t } = useTranslation();
  const nameOrEmailField = useRef<any>();
  const [found, setFound] = useState<People | undefined>();
  const [hasMadeARequest, setHasMadeARequest] = useState(false);
  const [contactRequestSent, setContactRequestSent] = useState(false);

  useEffect(() => {
    nameOrEmailField.current.focus();
  }, []);

  async function sendRequest() {
    if (!usersService) {
      usersService = UsersService.instance;
    }

    if (nameOrEmailField.current) {
      const foundUser: People = await usersService.findUserByNameOrEmail(nameOrEmailField.current.value);

      setFound(foundUser);
      setHasMadeARequest(true);

      nameOrEmailField.current.blur();
    }
  }

  function reset() {
    setFound(undefined);
    setContactRequestSent(false);
    (nameOrEmailField.current as HTMLInputElement).value = "";
  }

  function handleKeydown(e: React.KeyboardEvent) {
    if (e.code === "Enter") {
      sendRequest();
    }
  }

  async function addToMyContacts() {
    if (!permissionsService) {
      permissionsService = PermissionsService.instance;
    }

    if (found) {
      await permissionsService.addContactRequest(found);
      setContactRequestSent(true);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col px-4 mt-12 mb-4 w-72">
        <div className="flex flex-col justify-center my-12">
          <div className="text-xl">{t("findAContact")}</div>
          <input
            className="w-full mt-8"
            ref={nameOrEmailField}
            onFocus={() => {
              setHasMadeARequest(false);
              reset();
            }}
            type="text"
            placeholder={t("searchByFullnameOrEmail")}
            onKeyPress={(evt) => handleKeydown(evt)}
          />
          <button
            className={`mt-8  cursor-pointer ${hasMadeARequest && found ? "text-obs-faint" : "mod-cta"}`}
            onClick={hasMadeARequest && found ? undefined : sendRequest}
          >
            {t("sendRequest")}
          </button>
        </div>

        {hasMadeARequest && found ? (
          <>
            {contactRequestSent ? (
              <div className="w-full mb-4 text-center">{t("contactRequestSent")}</div>
            ) : (
              <div
                className={`flex items-center px-3 py-2 mb-4 space-x-2 text-sm ${
                  status === "requested" ? "bg-accent-1 border text-accent-4 border-accent-4 border-solid rounded-md" : ""
                }`}
              >
                <div className="flex-shrink-0">{peopleAvatar(found, 6)}</div>
                <div className="flex items-center justify-between w-full space-x-2 overflow-hidden">
                  <div className="flex flex-col flex-grow overflow-hidden">
                    <span className="flex flex-col">
                      <div className="truncate">{found.name ? found.name : found.email}</div>
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button className={`my-4 mod-cta cursor-pointer`} onClick={contactRequestSent ? () => nameOrEmailField.current.focus() : addToMyContacts}>
              {contactRequestSent ? t("searchAnotherContact") : t("addToMyContacts")}
            </button>
          </>
        ) : hasMadeARequest ? (
          <div className="mb-4">{t("nameOrEmailUserNotFound")}</div>
        ) : null}

        <div className="flex items-center mt-4 space-x-1 cursor-pointer" onClick={done}>
          <ArrowNarrowLeftIcon className="w-6 h-6" />
          <span>{t("back")}</span>
        </div>
      </div>
    </div>
  );
}
