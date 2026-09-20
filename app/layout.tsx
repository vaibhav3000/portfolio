import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const title = "Vaibhav Mahore - AI/ML Engineer";
const description =
  "AI/ML engineer at IISc Bangalore. Efficient sequence models (S4 → Mamba-3), " +
  "LLM evaluation infrastructure, and verifiable tool-using AI agents.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: "Vaibhav Mahore" }],
  keywords: [
    "Vaibhav Mahore",
    "AI/ML Engineer",
    "Machine Learning",
    "State Space Models",
    "Mamba",
    "LLM Evaluation",
    "IISc Bangalore",
  ],
  alternates: { canonical: new URL(`${basePath}/`, siteUrl).toString() },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    siteName: "Vaibhav Mahore Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#060709",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <head>
        {/* Marks JS availability so scroll-reveal styles only hide content when they can be shown again */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
