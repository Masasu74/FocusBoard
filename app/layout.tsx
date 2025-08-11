
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/ui/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focus Board",
  description: "Personal Task Manager Build By Masasu74",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased lg:px-10 lg:py-5 min-h-screen p-2`}
      >
   <Navbar/>

        {children}
         <p className="text-center mt-10">
        © 2025 FocusBoard. Built for productivity and focus.
      </p>
      </body>
    </html>
  );
}
