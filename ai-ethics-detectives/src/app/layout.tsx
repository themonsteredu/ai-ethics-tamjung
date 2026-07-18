import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI ?ㅻ━?먯젙??| 硫댟룹궡쨌?빧룸컼",
  description: "珥덈벑?숈깮???꾪븳 AI ?ㅻ━ ?щ? 湲곕컲 ?먯젙 ?좊줎 ?꾨줈洹몃옩",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17152f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
