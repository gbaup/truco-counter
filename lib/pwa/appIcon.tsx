import { ImageResponse } from "next/og";

export const PWA_BACKGROUND_COLOR = "#0D100E";
export const PWA_ICON_SIZES = [192, 512] as const;

/**
 * Placeholder app icon: a paper-colored playing card with a "T", centered
 * inside the maskable safe zone (inner 80%) so Android can crop it to any shape.
 */
export function renderAppIcon(size: number) {
    const cardWidth = size * 0.46;
    const cardHeight = size * 0.62;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: PWA_BACKGROUND_COLOR,
                }}
            >
                <div
                    style={{
                        width: cardWidth,
                        height: cardHeight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#F4ECDB",
                        border: `${Math.max(2, size * 0.012)}px solid #C2A878`,
                        borderRadius: size * 0.06,
                        transform: "rotate(-8deg)",
                        color: "#1A1410",
                        fontSize: size * 0.36,
                        fontWeight: 700,
                    }}
                >
                    T
                </div>
            </div>
        ),
        { width: size, height: size }
    );
}
