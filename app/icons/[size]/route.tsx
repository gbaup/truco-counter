import { PWA_ICON_SIZES, renderAppIcon } from "@/lib/pwa/appIcon";

export const dynamicParams = false;

export function generateStaticParams() {
    return PWA_ICON_SIZES.map((size) => ({ size: String(size) }));
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ size: string }> }
) {
    const { size } = await params;
    return renderAppIcon(Number(size));
}
