import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";
import Link from 'next/link';
import CookieGate from "@/components/CookieGate";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "ESGAY | The Abandoned Embassy",
  description: "End-Stage Gay Agenda Yardsale. A sanctuary for the radicalized and the unapologetic.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="font-punk">
        <Providers>
          <CookieGate />
          <Header user={user} />
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


