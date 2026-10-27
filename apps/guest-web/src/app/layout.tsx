import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'HOTELYO | Modern Hostel Platform for India & Touring Motorcyclists',
  description: 'Book beds, rooms, bike parking, and secure gear lockers. Fast arrival OTP and 24/7 emergency support.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                HOTEL<span className="text-brand-500">YO</span>
              </span>
              <span className="text-xs bg-moto-500 text-white font-bold px-1.5 py-0.5 rounded tracking-wide">
                MOTO READY
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/#faq"
                className="text-sm font-medium text-slate-300 hover:text-white transition"
              >
                FAQs
              </Link>
              <Link
                href="/#safety"
                className="text-xs font-semibold px-2.5 py-1 bg-red-950/80 border border-red-500/50 text-red-400 rounded-full hover:bg-red-900 transition flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                SOS Support
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/60 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 HOTELYO Platform (India). Built for Nomads & Touring Motorcyclists.</p>
            <p>Single Source of Truth PMS Architecture | GST Compliant (INR)</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
