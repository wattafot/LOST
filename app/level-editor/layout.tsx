import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "../globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Level Editor - The LOST Quiz",
  description: "Create and edit levels for The LOST Quiz",
};

export default function LevelEditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${figtree.variable} font-sans antialiased bg-gray-900 text-white overflow-hidden`}
      >
        <div className="h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}