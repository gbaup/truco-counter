"use client";

import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import OnboardingField from "./OnboardingField";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

const PasswordField = forwardRef<HTMLInputElement, Props>(function PasswordField(
  { label, hint, ...rest },
  ref
) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  return (
    <OnboardingField
      ref={ref}
      label={label ?? t("onboarding.passwordField.defaultLabel")}
      hint={hint}
      type={show ? "text" : "password"}
      autoComplete="new-password"
      className={show ? "" : "tracking-widest"}
      right={
        <button
          type="button"
          aria-label={show ? t("onboarding.passwordField.hideAriaLabel") : t("onboarding.passwordField.showAriaLabel")}
          onClick={() => setShow((s) => !s)}
          className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-text-dim"
        >
          {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      }
      {...rest}
    />
  );
});

export default PasswordField;
