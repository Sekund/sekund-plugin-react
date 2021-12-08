import Tooltip from "@/ui/common/Tooltip";
import { validateEmail } from "@/utils";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import PasswordValidator from "password-validator";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18nConf from "../../i18n.config";

type Props = {
  action: (email: string, password: string) => Promise<void>;
  actionLabel: JSX.Element;
  noPassword?: boolean;
};

export default function CredentialsValidator({ action, actionLabel, noPassword }: Props) {
  const { t } = useTranslation(["common", "plugin"], { i18n: i18nConf });
  const [badEmailFormat, setBadEmailFormat] = useState(false);
  const [badPassword, setBadPassword] = useState(false);
  const [badPasswordMessage, setBadPasswordMessage] = useState("");
  const emailField = useRef<any>();
  const passwordField = useRef<any>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [, setPage] = useState<"sendValidationLink" | "validationLinkSent">("sendValidationLink");

  function togglePasswordVisible() {
    const fieldType = passwordField.current?.type;
    passwordField.current.type = fieldType === "password" ? "text" : "password";
    setPasswordVisible(!passwordVisible);
  }

  async function validate() {
    let validEmail = false;
    let validPassword = false;
    validEmail = !!validateEmail(emailField.current.value);
    if (!validEmail) {
      setBadEmailFormat(true);
      return;
    } else if (noPassword) {
      await action(emailField.current.value, "••••••");
      setPage("validationLinkSent");
      return;
    }
    const schema = new PasswordValidator()
      .min(8)
      .is()
      .max(100)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits(2)
      .has()
      .symbols(1)
      .has()
      .not()
      .spaces();
    const validation = schema.validate(passwordField.current.value, { details: true }) as any[];
    validPassword = validation.length === 0;
    if (validation.length > 0) {
      setBadPasswordMessage(validation[0].message);
      setBadPassword(true);
    }
    if (validEmail && validPassword) {
      await action(emailField.current.value, passwordField.current.value);
      setPage("validationLinkSent");
    }
  }

  return (
    <div className="flex flex-col space-y-1 w-form">
      <div className="text-obs-muted">{t("specifyEmailAddress")}</div>
      <div className="relative">
        <input className="w-full" key="email" ref={emailField} type="email" placeholder="me@example.com" />
        <Tooltip open={badEmailFormat} setOpen={(o) => setBadEmailFormat(o)} text={t("badEmailFormat")} />
      </div>
      {!noPassword ? (
        <>
          <div className="text-obs-muted">{t("createPassword")}</div>
          <div className="relative flex items-center">
            <input className="w-full" key="password" ref={passwordField} type="password" placeholder="••••••••" />
            {passwordVisible ? (
              <EyeIcon onClick={togglePasswordVisible} className="absolute z-10 w-4 h-4 right-2 text-obs-muted hover:text-obs-normal" />
            ) : (
              <EyeOffIcon onClick={togglePasswordVisible} className="absolute z-10 w-4 h-4 right-2 text-obs-muted hover:text-obs-normal" />
            )}
            <Tooltip open={badPassword} setOpen={(o) => setBadPassword(o)} text={badPasswordMessage} />
          </div>
          <div className="text-sm text-obs-muted">{t("createPasswordDesc")}</div>
        </>
      ) : null}
      <div className="h-3"></div>
      <button onClick={validate} className="mr-0 text-center mod-cta">
        {actionLabel}
      </button>
    </div>
  );
}
