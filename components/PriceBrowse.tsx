'use client'

import { useState, useEffect } from 'react'
import { Phone } from '@/types'
import PhoneCard from './PhoneCard'
import { IndianRupee, Loader2 } from 'lucide-react'

const PRICE_TIERS = [
  { label: 'Under ₹10k', max: 10000 },
  { label: 'Under ₹15k', max: 15000 },
  { label: 'Under ₹20k', max: 20000 },
  { label: 'Under ₹25k', max: 25000 },
  { label: 'Under ₹30k', max: 30000 },
  { label: 'Sab phones', max: null },
]

export default function PriceBrowse() {
  const [selected, setSelected] = useState(PRICE_TIERS[2])
  const [phones, setPhones] = useState<Phone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPhones() {
      setLoading(true)
      try {
        const url = selected.max ? `/api/phones?max_price=${selected.max}` : '/api/phones'
        const res = await fetch(url)
        const data = await res.json()
        setPhones(data.phones || [])
      } catch {
        setPhones([])
      } finally {
        setLoading(false)
      }
    }
    loadPhones()
  }, [selected])

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <IndianRupee className="w-5 h-5 text-[#FF6B00]" />
        <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
          Budget ke hisaab se dekho
        </h2>
      </div>

      {/* Scrollable price pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {PRICE_TIERS.map((tier) => (
          <button
            key={tier.label}
            onClick={() => setSelected(tier)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selected.label === tier.label
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* Phone grid */}
      {loading ? (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : phones.length === 0 ? (
        <div className="mt-8 text-center py-10 text-gray-400 text-sm">
          Is budget mein koi phone nahi mila
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {phones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      )}
    </section>
  )
}
