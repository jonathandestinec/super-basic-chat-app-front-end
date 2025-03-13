import "./globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Super BAsi Chat App",
  description: "Just as it says",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
