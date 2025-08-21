import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bay Area Community Resources - Food Banks, Shelters & Health Services",
    template: "%s"
  },
  description: "Find food banks, shelters, and health services across the Bay Area including San Francisco, San Jose, Oakland with real-time hours and availability. Emergency assistance for those in need.",
  keywords: [
    "food bank", "shelter", "community resources", "Bay Area", "San Francisco", 
    "San Jose", "Oakland", "emergency help", "homeless services", "free clinic",
    "soup kitchen", "food pantry", "emergency shelter", "health clinic"
  ],
  authors: [{ name: "Community Resource Mapper" }],
  creator: "Community Resource Mapper",
  publisher: "Community Resource Mapper",
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Bay Area Community Resources - Food Banks, Shelters & Health Services",
    description: "Find food banks, shelters, and health services across the Bay Area with real-time hours and availability.",
    siteName: "Bay Area Community Resources",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bay Area Community Resources",
    description: "Find food banks, shelters, and health services across the Bay Area",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Structured Data for the Directory */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Bay Area Community Resources",
              "description": "Directory of food banks, shelters, and health services in the Bay Area",
              "url": "http://localhost:3000",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "http://localhost:3000/?category={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "San Francisco",
                  "addressRegion": "CA",
                  "addressCountry": "US"
                },
                {
                  "@type": "City", 
                  "name": "San Jose",
                  "addressRegion": "CA",
                  "addressCountry": "US"
                },
                {
                  "@type": "City",
                  "name": "Oakland", 
                  "addressRegion": "CA",
                  "addressCountry": "US"
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}