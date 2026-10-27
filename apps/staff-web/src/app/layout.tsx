import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'HOTELYO PMS | Staff & Front-Desk Operations',
  description: 'Single Source of Truth Property Management System for Hostel Operations, Housekeeping, and Access Codes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-950 text-slate-100 flex flex-col min-h-screen">
        {/* Operations Header */}
        <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-white">
                HOTEL<span className="text-blue-500">YO</span>
              </span>
              <span className="text-xs bg-blue-950 text-blue-400 font-extrabold px-2 py-0.5 rounded border border-blue-800/60 uppercase tracking-wider">
                PMS Staff Portal
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-2.5 py-1 rounded-full font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Front-Desk Live
              </span>
              <span className="text-slate-400">Shift: Vikram Sethi (GM)</span>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-800 bg-slate-900/50 py-4 text-center text-xs text-slate-500">
          HOTELYO PMS Single Source of Truth • Local Front-Desk Terminal • Port 3001
        </footer>
      </body>
    </html>
  );
}
