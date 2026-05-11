import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

// Since Editorial New is a premium/custom font, we fallback to a standard Serif for now
// In a real scenario, we would use localFont for Editorial New.
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
      <body className={spaceMono.className}>
        <div className="embassy-container">
          {children}
        </div>
      </body>
    </html>
  );
}
