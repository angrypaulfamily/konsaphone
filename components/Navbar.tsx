'use client'

import Link from 'next/link'
import { Smartphone } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#1B4FD8] flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-[#FF6B00]">Konsa</span>
            <span className="text-[#1B4FD8]">Phone</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-gray-500 italic">
            Ab pata chalega 🎯
          </span>
        </div>
      </div>
    </nav>
  )
}
