import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KonsaPhone — Ab Pata Chalega',
  description:
    'India ka smartest phone comparison app. Compare phones side by side, get Priya ki personal recommendation. Sahi phone choose karo!',
  keywords: 'phone comparison india, best phone india, konsaphone, priya phone recommendation',
  openGraph: {
    title: 'KonsaPhone — Ab Pata Chalega',
    description: 'Compare phones. Get Priya ki sahi recommendation. No confusion.',
    siteName: 'KonsaPhone',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-[#FFFBF5]">{children}</body>
    </html>
  )
}
