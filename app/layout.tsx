import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "电商主图一键生成",
  description: "使用 OpenAI 一键生成电商主图",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
