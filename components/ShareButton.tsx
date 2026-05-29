'use client'

import { Share2 } from 'lucide-react'

export default function ShareButton() {
  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'KonsaPhone — Priya ka Verdict', url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0"
      aria-label="Share"
    >
      <Share2 className="w-4 h-4" />
    </button>
  )
}
