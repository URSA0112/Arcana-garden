import type { Metadata } from 'next'
import { Cormorant_Garamond, Cinzel_Decorative } from 'next/font/google'
import './globals.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { Analytics } from '@vercel/analytics/react'
import VisitTracker from './components/VisitTracker'

const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-title',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorantBody = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Arcana Garden',
  description: 'A tarot learning and reading platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzelDecorative.variable} ${cormorant.variable} ${cormorantBody.variable}`}>
      <body className="min-h-screen flex flex-col">
        <NavBar />
        <VisitTracker />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
