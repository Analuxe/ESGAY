import type { Metadata } from "next";
import { Space_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Link from 'next/link';

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-punk",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-luxe",
});

export const metadata: Metadata = {
  title: "ESGAY | The Abandoned Embassy",
  description: "End-Stage Gay Agenda Yardsale. A sanctuary for the radicalized and the unapologetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${playfair.variable} font-punk`}>
        <Providers>
          <div className="embassy-container">
            {children}
          </div>
          
          <Link href="/customs" style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            fontFamily: 'var(--font-punk)',
            color: 'var(--tarnished-gold)',
            border: '1px solid var(--tarnished-gold)',
            padding: '0.75rem 1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            backgroundColor: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            transition: 'all 0.3s ease'
          }} className="subversive-btn">
            View Manifest
          </Link>
        </Providers>
      </body>
    </html>
  );
}
