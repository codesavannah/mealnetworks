import type { Metadata } from "next";
import { Geist, Geist_Mono, Varela_Round } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const varelaRound = Varela_Round({
  variable: "--font-varela-round",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "MealNetworks - Food Donation Platform",
  description: "Connect donors with NGOs to reduce food waste and fight hunger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${varelaRound.variable}`}>
        <ThemeRegistry>
          <Navbar />
          <main style={{ paddingTop: 64 }}>{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
