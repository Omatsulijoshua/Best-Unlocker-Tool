import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Best Unlocker Tool",
  description: "Legal password recovery assistance, licensing, and admin-managed support."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
