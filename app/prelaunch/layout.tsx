// app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Barlow } from "next/font/google";
import React from "react";
import styles from "./prelaunch.module.css";
import { Toaster } from "sonner";

// Fonts
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// Comprehensive SEO metadata [AI Generated]
export const metadata: Metadata = {
  title: {
    default: "ghumakker - India's First Group Trip Platform",
    template: "%s | ghumakker"
  },
  description: "ghumakker is India's first search and discovery platform exclusively for fixed departure group trips. Connect trip organizers with travelers, grow your community, and discover amazing group adventures.",
  keywords: ["group trips", "travel", "adventure", "trek", "expedition", "tour organizer", "India travel", "group travel", "fixed departure"],
  authors: [{ name: "ghumakker Team" }],
  creator: "ghumakker",
  publisher: "ghumakker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ghumakker.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ghumakker - India's First Group Trip Platform",
    description: "Connect with trip organizers and discover amazing group adventures across India. Join the community of travelers and organizers.",
    url: 'https://ghumakker.com', // Replace with your actual domain
    siteName: 'ghumakker',
    images: [
      {
        url: '/hero.png',
        width: 1200,
        height: 630,
        alt: 'ghumakker - Group Trip Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ghumakker - India's First Group Trip Platform",
    description: "Connect with trip organizers and discover amazing group adventures across India.",
    images: ['/hero.png'],
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
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // apply font variables and set the root font-size to 14px (smaller overall scale)
      className={`${barlow.variable} ${poppins.variable} text-[13px]`}
    >
      <body className="antialiased">
        {/* if you need a wrapper div for project-specific CSS, keep it */}
        <div className="min-h-screen text-base">
          {children}
          <Toaster richColors position="top-center" />
        </div>
      </body>
    </html>
  );
}