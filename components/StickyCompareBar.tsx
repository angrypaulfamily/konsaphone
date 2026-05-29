'use client'

import { Phone, PaymentTier } from '@/types'
import { useState } from 'react'
import PaymentModal from './PaymentModal'

interface StickyCompareBarProps {
  phone1: Phone
  phone2: Phone
}

export default function StickyCompareBar({ phone1, phone2 }: StickyCompareBarProps) {
  const [selectedTier, setSelectedTier] = useState<PaymentTier | null>(null)

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* Phone names + prices */}
          <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
            {[phone1, phone2].map((phone) => (
              <div key={phone.id} className="min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{phone.name}</p>
                <p className="text-xs text-[#FF6B00] font-semibold">
                  Rs.{phone.price_inr.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setSelectedTier(49)}
            className="flex-shrink-0 bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white font-bold text-xs px-4 py-3 rounded-2xl whitespace-nowrap hover:opacity-90 transition-opacity animate-pulse-orange"
          >
            Priya se pucho
            <span className="ml-1 opacity-80">Rs.49</span>
          </button>
        </div>
      </div>

      {selectedTier && (
        <PaymentModal
          tier={selectedTier}
          phone1={phone1}
          phone2={phone2}
          onClose={() => setSelectedTier(null)}
        />
      )}
    </>
  )
}
