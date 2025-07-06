import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PWAProvider } from "@/components/pwa-provider"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "PowerPlant - Smart Plant Recommendations",
    template: "%s | PowerPlant",
  },
  description:
    "Discover plants guaranteed to thrive in your space and climate. Get personalized recommendations based on your location, experience, and goals.",
  keywords: ["plants", "gardening", "recommendations", "nursery", "local plants", "garden planning"],
  authors: [{ name: "PowerPlant Team" }],
  creator: "PowerPlant",
  publisher: "PowerPlant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://powerplant.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://powerplant.app",
    title: "PowerPlant - Smart Plant Recommendations",
    description: "Discover plants guaranteed to thrive in your space and climate",
    siteName: "PowerPlant",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PowerPlant - Smart Plant Recommendations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerPlant - Smart Plant Recommendations",
    description: "Discover plants guaranteed to thrive in your space and climate",
    images: ["/og-image.jpg"],
    creator: "@powerplantapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2D5A27" },
    { media: "(prefers-color-scheme: dark)", color: "#2D5A27" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PowerPlant" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "PowerPlant",
              description: "Smart plant recommendations for your garden",
              url: "https://powerplant.app",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <PWAProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </PWAProvider>
        </Suspense>
      </body>
    </html>
  )
}
