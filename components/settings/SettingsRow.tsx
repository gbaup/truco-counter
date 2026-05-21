"use client";

import { twMerge } from "tailwind-merge";
import SettingsToggle from "./SettingsToggle";

type SettingsRowProps =
  | {
      label: string;
      value?: string;
      action?: string;
      onAction?: () => void;
      danger?: boolean;
      isMono?: boolean;
      isLastInGroup?: boolean;
      toggle?: false;
    }
  | {
      label: string;
      toggle: true;
      on: boolean;
      onChange: (v: boolean) => void;
      isLastInGroup?: boolean;
    };

export default function SettingsRow(props: SettingsRowProps) {
  const isLast = props.isLastInGroup;

  if (props.toggle) {
    return (
      <div
        className={twMerge(
          "flex items-center justify-between bg-surface px-4 py-3.5",
          !isLast && "border-b border-border"
        )}
      >
        <span className="text-sm font-medium text-text">{props.label}</span>
        <SettingsToggle on={props.on} onChange={props.onChange} label={props.label} />
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        "flex items-center justify-between bg-surface px-4 py-3.5",
        !isLast && "border-b border-border"
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className={twMerge(
            "text-sm font-medium",
            props.danger ? "text-danger" : "text-text"
          )}
        >
          {props.label}
        </span>
        {props.value && (
          <span
            className={twMerge(
              "mt-0.5 text-xs",
              props.isMono ? "font-display text-text-dim" : "text-text-dim"
            )}
          >
            {props.value}
          </span>
        )}
      </div>
      {props.action && props.onAction && (
        <button
          type="button"
          onClick={props.onAction}
          className={twMerge(
            "ml-3 shrink-0 text-xs font-semibold",
            props.danger ? "text-danger" : "text-us"
          )}
        >
          {props.action}
        </button>
      )}
    </div>
  );
}
