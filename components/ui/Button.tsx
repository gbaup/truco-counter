import React, { ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

const buttonVariants = tv({
  base: [
    "relative flex items-center justify-center gap-2 overflow-hidden rounded-xl font-bold transition-all",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "focus:outline-none focus:ring-2 focus:ring-us/50",
  ],
  variants: {
    variant: {
      primary: "group bg-us text-white hover:bg-us-deep disabled:bg-surface-elevated",
      secondary: "group bg-them text-white hover:bg-them-deep disabled:bg-surface-elevated",
      simple: "bg-us text-white hover:bg-us-deep active:scale-95 disabled:active:scale-100",
      outline: "border-2 border-us text-us hover:bg-us/10",
      ghost: "text-us hover:bg-us/10",
      danger: "group bg-danger text-white hover:bg-danger/90 disabled:bg-surface-elevated",
    },
    size: {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
    fullWidth: true,
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      isLoading,
      loadingText,
      disabled,
      ...props
    },
    ref
  ) => {
    const styles = twMerge(buttonVariants({ variant, size, fullWidth, className }));
    return (
      <button
        ref={ref}
        className={styles}
        disabled={isLoading || disabled}
        {...props}
      >
        <div className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && (
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isLoading && loadingText ? loadingText : children}
        </div>

        {variant === "primary" && !isLoading && !disabled && (
          <div className="absolute inset-0 z-0 origin-left scale-x-0 bg-us-deep transition-transform duration-300 group-hover:scale-x-100" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
