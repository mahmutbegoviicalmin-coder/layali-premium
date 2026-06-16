import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Layali — Premium Hookah Flavor Wholesale",
    template: "%s | Layali Wholesale",
  },
  description:
    "Wholesale distribution of premium hookah and shisha flavors for cafes, lounges, bars, and tobacco retailers. Product discovery and B2B inquiries.",
  keywords: [
    "hookah wholesale",
    "shisha flavors",
    "B2B tobacco",
    "premium hookah distributor",
    "Layali",
  ],
  openGraph: {
    title: "Layali — Premium Hookah Flavor Wholesale",
    description:
      "Wholesale distribution of the world's most demanded shisha flavors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
