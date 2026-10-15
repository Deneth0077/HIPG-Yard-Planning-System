import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'HIPG Yard & Terminal Command Center | Digital Twin v4.2',
  description:
    'Hambantota International Port Group — Real-time 3D Digital Twin for RoRo Yard Planning and Logistics Management. Interactive isometric view of the complete HIPG terminal.',
  keywords: 'HIPG, Hambantota Port, RoRo, Yard Planning, Digital Twin, Port Logistics, 3D Terminal',
  authors: [{ name: 'HIPG Operations' }],
  robots: 'noindex, nofollow', // internal system
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="antialiased bg-[#080d14] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
