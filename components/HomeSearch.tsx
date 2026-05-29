'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import { Phone } from '@/types'
import { ArrowRight } from 'lucide-react'

export default function HomeSearch() {
  const router = useRouter()
  const [phone1, setPhone1] = useState<Phone | null>(null)
  const [phone2, setPhone2] = useState<Phone | null>(null)

  function handleCompare() {
    if (phone1 && phone2) {
      router.push(`/compare?phone1=${phone1.id}&phone2=${phone2.id}`)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Phone 1
        </label>
        <SearchBar
          onSelect={(p) => setPhone1(p)}
          selectedPhone={phone1}
          placeholder="Pehla phone dhundo..."
          excludeId={phone2?.id}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">VS</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Phone 2
        </label>
        <SearchBar
          onSelect={(p) => setPhone2(p)}
          selectedPhone={phone2}
          placeholder="Doosra phone dhundo..."
          excludeId={phone1?.id}
        />
      </div>

      <button
        onClick={handleCompare}
        disabled={!phone1 || !phone2}
        className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98]"
      >
        Compare Karo
        <ArrowRight className="w-5 h-5" />
      </button>

      {(!phone1 || !phone2) && (
        <p className="text-center text-xs text-gray-400">
          Dono phones select karo compare karne ke liye
        </p>
      )}
    </div>
  )
}
