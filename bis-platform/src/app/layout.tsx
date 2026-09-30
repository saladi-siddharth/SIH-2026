import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/layout/client-providers";

export const metadata: Metadata = {
  title: "BIS Intelligence — Evidence-backed Indian Standards Platform",
  description:
    "An intelligent platform for discovering, understanding and verifying Bureau of Indian Standards (BIS) standards, powered by AI and grounded in official documents.",
  keywords: [
    "BIS",
    "Bureau of Indian Standards",
    "Indian Standards",
    "ISI",
    "IS code",
    "MSME",
    "certification",
    "compliance",
    "BIS mark",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
