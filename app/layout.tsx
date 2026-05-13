import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import NavBar from './components/NavBar'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
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
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="text-center py-8 text-xs tracking-[0.2em] uppercase" style={{ color: '#3a5228' }}>
          ✦ &nbsp;Arcana Garden&nbsp; ✦
        </footer>
      </body>
    </html>
  )
}
