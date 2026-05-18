import type { Metadata } from "next";
import { Inter, Crimson_Pro, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import I18nProvider from "@/components/I18nProvider";
import { twMerge } from "tailwind-merge";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "TrucoPro",
  description: "Contador · Ranking · Historial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={twMerge(
          inter.variable,
          crimsonPro.variable,
          spaceGrotesk.variable,
          "antialiased font-sans"
        )}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
