import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 윤리탐정단 | 마지막 판단은 내가 해요",
  description: "사실·사람·가치·행동을 연결하며 책임 있는 AI 사용을 배우는 초등 윤리 수업",
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
