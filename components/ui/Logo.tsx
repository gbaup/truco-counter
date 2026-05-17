"use client";

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 24 }: LogoProps) {
  return (
    <div className="flex items-baseline leading-none select-none">
      <span
        className="italic font-bold text-text"
        style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: size }}
      >
        truco
      </span>
      <span
        className="not-italic font-extrabold text-us"
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui",
          fontSize: size,
          letterSpacing: "-0.02em",
        }}
      >
        PRO
      </span>
    </div>
  );
}
