import type { Metadata } from "next";
import "./globals.css";
import { AccessibilityProvider } from "@/app/context/AccessibilityContext";

export const metadata: Metadata = {
  title: "Memory & Puzzle - Dementia Memory & Activity App",
  description: "Simple, calm, and encouraging cognitive activities for senior citizens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-[#F7F5EF] text-[#24302A]">
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
