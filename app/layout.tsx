import type { Metadata } from "next";
import { Bitter, Manrope } from "next/font/google";
import "./globals.css";

const display = Bitter({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-display",
});
const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Bingo Night",
  description: "Custom-content bingo, played together on any device.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body bg-ink text-card min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
