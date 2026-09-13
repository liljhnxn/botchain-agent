import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientShell } from "./client-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Botchain Agent Marketplace",
  description: "Decentralized marketplace for AI agents deployed on Botchain testnet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#07111f] text-white">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
