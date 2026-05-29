"use client";

import { forwardRef, useState } from "react";
import OnboardingField from "./OnboardingField";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

const EyeIcon = ({ off }: { off: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const PasswordField = forwardRef<HTMLInputElement, Props>(function PasswordField(
  { label = "Contraseña", hint, ...rest },
  ref
) {
  const [show, setShow] = useState(false);
  return (
    <OnboardingField
      ref={ref}
      label={label}
      hint={hint}
      type={show ? "text" : "password"}
      autoComplete="new-password"
      className={show ? "" : "tracking-widest"}
      right={
        <button
          type="button"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setShow((s) => !s)}
          className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-text-dim"
        >
          <EyeIcon off={show} />
        </button>
      }
      {...rest}
    />
  );
});

export default PasswordField;
