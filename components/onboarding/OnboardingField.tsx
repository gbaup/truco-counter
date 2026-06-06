"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
  hint?: string;
  mono?: boolean;
  right?: React.ReactNode;
  containerClassName?: string;
};

const OnboardingField = forwardRef<HTMLInputElement, Props>(function OnboardingField(
  { label, error, hint, mono, right, id, className, containerClassName, ...input },
  ref
) {
  const hasError = !!error;
  return (
    <div className="w-full">
      <div
        className={twMerge(
          "bg-surface rounded-lg px-3.5 py-2.5 border transition-colors flex items-center gap-2.5",
          hasError ? "border-danger" : "border-border focus-within:border-us/50",
          containerClassName
        )}
      >
        <div className="flex-1 min-w-0">
          <label
            htmlFor={id}
            className={twMerge(
              "text-caption-italic block cursor-pointer",
              hasError ? "text-danger" : "text-text-dim"
            )}
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {label}
          </label>
          <input
            id={id}
            ref={ref}
            className={twMerge(
              "w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 focus:outline-none",
              "placeholder:text-text-mute placeholder:italic placeholder:font-semibold",
              mono && "font-[var(--font-space-grotesk),sans-serif]",
              className
            )}
            {...input}
          />
        </div>
        {right}
      </div>
      {(error || hint) && (
        <p
          className={twMerge(
            "text-[11px] mt-1.5 pl-1 italic",
            hasError ? "text-danger" : "text-text-mute"
          )}
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
});

export default OnboardingField;
