/**
 * Every icon accepts:
 *   size      — pixel width/height (viewBox is always 0 0 24 24)
 *   className — forwarded to <svg> for color/size overrides via Tailwind
 */
import { Icon } from "@iconify/react";

interface IconProps {
  size?: number;
  className?: string;
}

export function MenuIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:list" width={size} height={size} className={className} />
  );
}

export function CloseIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:x" width={size} height={size} className={className} />
  );
}

export function PlusIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:plus-bold" width={size} height={size} className={className} />
  );
}

export function MinusIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:minus-bold" width={size} height={size} className={className} />
  );
}

export function PencilIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:note-pencil-duotone" width={size} height={size} className={className} />
  );
}

export function CopyIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:copy" width={size} height={size} className={className} />
  );
}

export function CheckIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:check" width={size} height={size} className={className} />
  );
}

export function RefreshIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:arrows-clockwise" width={size} height={size} className={className} />
  );
}

export function SearchIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:magnifying-glass" width={size} height={size} className={className} />
  );
}

export function FilterIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}

export function EyeIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:eye" width={size} height={size} className={className} />
  );
}

export function EyeOffIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:eye-closed" width={size} height={size} className={className} />
  );
}

export function LockIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:lock" width={size} height={size} className={className} />
  );
}

export function ChevronLeftIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:caret-left" width={size} height={size} className={className} />
  );
}

export function ChevronRightIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:caret-right" width={size} height={size} className={className} />
  );
}

export function ArrowRightIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:arrow-right" width={size} height={size} className={className} />
  );
}

/** Always renders spinning — add `className="h-5 w-5"` for size, or pass `size`. */
export function SpinnerIcon({ size, className }: IconProps) {
  return (
    <Icon icon="ph:spinner-gap" width={size} height={size} className={className} />
  );
}

export function WhatsAppIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:whatsapp-logo" width={size} height={size} className={className} />
  );
}

export function UsersIcon({ size = 24, className }: IconProps) {
  return (
    <Icon icon="ph:users-three" width={size} height={size} className={className} />
  );
}
