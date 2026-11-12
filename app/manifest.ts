import type { MetadataRoute } from "next";
import { PWA_BACKGROUND_COLOR, PWA_ICON_SIZES } from "@/lib/pwa/appIcon";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "TrucoPro",
        short_name: "TrucoPro",
        description: "Contador · Ranking · Historial",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: PWA_BACKGROUND_COLOR,
        theme_color: PWA_BACKGROUND_COLOR,
        lang: "es",
        icons: PWA_ICON_SIZES.flatMap((size) =>
            (["any", "maskable"] as const).map((purpose) => ({
                src: `/icons/${size}`,
                sizes: `${size}x${size}`,
                type: "image/png",
                purpose,
            }))
        ),
    };
}
