import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

export const metadata: Metadata = {
  title: "Creative Technologist: EJ",
  description: "Portfolio of Elijah James Cubing, building scalable, user-focused digital platforms."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable} bg-surface-900 font-body text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
