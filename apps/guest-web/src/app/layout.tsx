import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HOTELYO Nomad & Moto Hostel, Anjuna, Goa',
  description: 'Book beds, rooms, bike parking, and secure gear lockers. Fast arrival OTP and 24/7 emergency support.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020617" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Public+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 font-body antialiased min-h-screen selection:bg-amber-500 selection:text-slate-950 flex flex-col items-center">
        {children}
      </body>
    </html>
  );
}
