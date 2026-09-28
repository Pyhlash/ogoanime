import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ogoanime — твоё место в мире аниме",
  description: "Аниме в русской озвучке, новые серии и твоя личная библиотека.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
