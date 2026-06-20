import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECO MIND AI — Understand. Track. Reduce.",
  description:
    "AI-Powered Carbon Footprint Awareness Platform. Track your carbon emissions, get personalized AI recommendations, and join sustainability challenges to reduce your environmental impact.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "AI",
    "climate change",
    "eco-friendly",
    "green living",
    "carbon tracker",
    "Gemini AI",
  ],
  authors: [{ name: "ECO MIND AI Team" }],
  openGraph: {
    title: "ECO MIND AI — Understand. Track. Reduce.",
    description:
      "AI-Powered Carbon Footprint Awareness Platform helping individuals reduce their carbon footprint.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
