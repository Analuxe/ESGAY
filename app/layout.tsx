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

const BaroqueCorner = ({ className }: { className: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`baroque-corner ${className}`}
  >
    {/* Ornate neoclassical scrollwork and curls */}
    <path 
      d="M5,5 H95 C75,5 60,15 50,30 C40,45 42,60 30,75 C15,90 5,95 5,95 V5 Z" 
      stroke="currentColor" 
      strokeWidth="0.5" 
      strokeDasharray="3 2" 
      opacity="0.6" 
    />
    <path 
      d="M12,12 C25,12 35,16 40,25 C45,34 38,45 32,50 C26,55 12,58 12,58 V12 Z" 
      stroke="currentColor" 
      strokeWidth="0.75" 
    />
    <path 
      d="M8,8 L92,8 C80,12 68,22 58,35 C48,48 48,60 35,72 C22,84 12,92 8,92 V8 Z" 
      stroke="currentColor" 
      strokeWidth="0.25" 
      opacity="0.4" 
    />
    <path 
      d="M15,15 Q28,12 32,22 T18,35 Q12,38 15,15 Z" 
      fill="currentColor" 
      opacity="0.15" 
    />
    <path 
      d="M15,15 Q12,28 22,32 T35,18 Q38,12 15,15 Z" 
      fill="currentColor" 
      opacity="0.15" 
    />
    <path 
      d="M22,22 C28,18 35,22 35,28 C35,35 28,38 22,32 C16,26 18,18 25,15" 
      stroke="currentColor" 
      strokeWidth="0.5" 
    />
    <path 
      d="M28,28 C34,24 40,28 40,34 C40,40 34,44 28,38 T28,28" 
      stroke="currentColor" 
      strokeWidth="0.5" 
    />
    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    <circle cx="18" cy="18" r="1.2" fill="currentColor" />
    <circle cx="26" cy="26" r="1" fill="currentColor" />
    <circle cx="34" cy="34" r="0.8" fill="currentColor" />
    <circle cx="42" cy="42" r="0.6" fill="currentColor" />
    <circle cx="50" cy="50" r="0.5" fill="currentColor" />
  </svg>
);

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
          
          {/* Subtle Lacroix Baroque Framing embellishments */}
          <div className="embassy-viewport-frame" />
          <BaroqueCorner className="baroque-corner-tl" />
          <BaroqueCorner className="baroque-corner-tr" />
          <BaroqueCorner className="baroque-corner-bl" />
          <BaroqueCorner className="baroque-corner-br" />

          <div className="embassy-container">
            {children}
          </div>
          
          <Link href="/customs" style={{
            position: 'fixed',
            bottom: '2.5rem',
            right: '2.5rem',
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
