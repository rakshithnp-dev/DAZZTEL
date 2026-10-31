import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HOTELYO PMS • Front-Desk Console & Operations',
  description: 'Hostel Property Management System for room tape charts, arrival verification, housekeeping, and motorcyclist operations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f9fbfc] text-[#131416] font-sans min-h-screen antialiased selection:bg-[#1b6c80] selection:text-white">
        {children}
      </body>
    </html>
  );
}
