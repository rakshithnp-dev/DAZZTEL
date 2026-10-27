import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HOTELYO Admin | Platform Governance & Analytics',
  description: 'Enterprise Platform Administration, Occupancy & Revenue Analytics, Multi-Property Configuration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-950 text-gray-100 flex flex-col min-h-screen">
        <header className="border-b border-gray-800 bg-gray-900/90 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-white">
                HOTEL<span className="text-purple-500">YO</span>
              </span>
              <span className="text-xs bg-purple-950 text-purple-400 font-extrabold px-2 py-0.5 rounded border border-purple-800/60 uppercase tracking-wider">
                Platform Admin
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full font-mono">
                System Mode: Production-Oriented
              </span>
              <span className="text-gray-400">Admin: Super Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-800 bg-gray-900/50 py-4 text-center text-xs text-gray-500">
          HOTELYO Multi-Property Platform Administration • Port 3002
        </footer>
      </body>
    </html>
  );
}
