import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { QueryProvider } from '@/provider/query-provider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Granero el oriente',
  description: 'Sistema de gestión para Granero el oriente',
  generator: 'jpulido.dev',
  icons: {
    icon: [{
      url: '/img/vegan.svg',
      type: 'image/svg+xml',
    }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_geist.className} ${_geistMono.className}`}>
        <QueryProvider>
          {children}
          <Analytics />
        </ QueryProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
