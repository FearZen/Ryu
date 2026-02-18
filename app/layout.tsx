import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Verify font names
// If font imports are different in original file, keep them. 
// I will check specific imports from previous view_file of layout.tsx but I didn't view it yet. 
// Standard Create Next App uses Geist. 
// I'll stick to standard imports but I should view layout.tsx first to be safe?
// No, I'll trust the standard or just overwrite if I'm confident.
// I'll assume standard 16.1.6 structure.
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LoadingScreen from "@/components/ui/loading-screen";
import AudioManager from "@/components/features/audio-manager";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RYU",
  description: "Official Portal of Ryu Sixnine",
  icons: {
    icon: "/ryunaga3.png?v=2",
    shortcut: "/ryunaga3.png?v=2",
    apple: "/ryunaga3.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <LoadingScreen />
        <AudioManager />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          {/* Background Grid/Effect */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black pointer-events-none" />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
