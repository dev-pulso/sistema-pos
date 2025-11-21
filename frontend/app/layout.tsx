import type { Metadata } from 'next'
import { Geist, Geist_Mono, Poppins, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { QueryProvider } from '@/provider/query-provider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css'
import { ThemeProvider } from '@/components/theme-provider';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: 'Tienda Oriental',
  description: 'Sistema de gestión para Tienda Oriental',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${_inter.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <QueryProvider>
            {children}
            <Analytics />
          </ QueryProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
