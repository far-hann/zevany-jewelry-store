import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/SimpleFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});


export const metadata: Metadata = {
  title: 'ZEVANY - Luxury Jewelry Store',
  description: 'Discover exquisite luxury jewelry at ZEVANY. Shop premium rings, necklaces, earrings, and bracelets.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', type: 'image/svg+xml', sizes: '16x16' },
      { url: '/favicon-32x32.svg', type: 'image/svg+xml', sizes: '32x32' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml', sizes: '180x180' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorantGaramond.variable} antialiased font-sans bg-white`}>
        <Navbar />
        <main>
          {children}
        </main>
        <SimpleFooter />
      </body>
    </html>
  );
}
