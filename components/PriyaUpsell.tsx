'use client'

import { useState } from 'react'
import PriyaAvatar from './PriyaAvatar'
import PaymentModal from './PaymentModal'
import { Phone, PaymentTier } from '@/types'
import { Sparkles, ListOrdered } from 'lucide-react'

interface PriyaUpsellProps {
  phone1: Phone
  phone2: Phone
}

export default function PriyaUpsell({ phone1, phone2 }: PriyaUpsellProps) {
  const [selectedTier, setSelectedTier] = useState<PaymentTier | null>(null)

  return (
    <>
      <div className="animate-slide-up rounded-3xl overflow-hidden shadow-xl border border-orange-200 bg-gradient-to-br from-white to-orange-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-orange-500 p-5">
          <div className="flex items-start gap-3">
            <PriyaAvatar size="md" animated />
            <div className="flex-1">
              <p className="text-white font-bold text-base leading-snug">
                Confused ho? Main Priya hoon 👋
              </p>
              <p className="text-orange-100 text-sm mt-1 leading-relaxed">
                Main tujhe sahi phone choose karwa sakti hoon. Bas 3 sawaal, aur tera perfect phone ready!
              </p>
            </div>
          </div>
        </div>

        {/* Tier cards */}
        <div className="p-4 space-y-3">
          {/* ₹49 tier */}
          <button
            onClick={() => setSelectedTier(49)}
            className="w-full text-left p-4 rounded-2xl border-2 border-gray-200 hover:border-[#FF6B00] hover:bg-orange-50 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-orange-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-[#FF6B00]">₹49</span>
                  <span className="text-sm font-bold text-gray-800">Priya ka Pick</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Kaunsa phone lena chahiye - seedha jawab, personalized to your needs
                </p>
              </div>
              <div className="text-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</div>
            </div>
          </button>

          {/* ₹99 tier */}
          <button
            onClick={() => setSelectedTier(99)}
            className="w-full text-left p-4 rounded-2xl border-2 border-[#1B4FD8] bg-blue-50/50 hover:bg-blue-50 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-2 right-3">
              <span className="text-xs font-bold text-white bg-[#1B4FD8] px-2 py-0.5 rounded-full">
                Best Value
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4FD8] to-indigo-500 flex items-center justify-center flex-shrink-0">
                <ListOrdered className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 pr-16">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-[#1B4FD8]">₹99</span>
                  <span className="text-sm font-bold text-gray-800">Priya ka Full Analysis</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  5 phones compare, ranked list, Flipkart & Amazon deals flagged
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Trust footer */}
        <div className="px-4 pb-4 flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>🔒 Secure UPI payment</span>
          <span>⚡ Instant result</span>
          <span>🇮🇳 Made in India</span>
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
