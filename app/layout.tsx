import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Visa Advisor — do you need a visa?",
  description:
    "Find out if you need a visa for your next trip, with citations from official government sources. Photo tool included.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://visa-advisor.vercel.app",
  ),
  openGraph: {
    title: "Visa Advisor — do you need a visa?",
    description:
      "Instant visa requirements for any passport and destination, with official citations. Free photo compliance tool included.",
    siteName: "Visa Advisor",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visa Advisor — do you need a visa?",
    description:
      "Instant visa requirements for any passport and destination, with official citations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      {adsenseClientId && (
        <head>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </head>
      )}
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
