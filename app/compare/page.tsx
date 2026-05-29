'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import CompareTable from '@/components/CompareTable'
import PriyaUpsell from '@/components/PriyaUpsell'
import StickyCompareBar from '@/components/StickyCompareBar'
import { Phone } from '@/types'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_PHONE_NAMES = ['Redmi Note 15 Pro', 'OnePlus Nord CE 6']

async function fetchPhoneById(id: string): Promise<Phone | null> {
  const res = await fetch(`/api/phones?id=${id}`)
  const data = await res.json()
  return data.phone || null
}

async function fetchPhoneByName(name: string): Promise<Phone | null> {
  const res = await fetch(`/api/phones?q=${encodeURIComponent(name)}`)
  const data = await res.json()
  return data.phones?.[0] || null
}

function CompareContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone1Id = searchParams.get('phone1')
  const phone2Id = searchParams.get('phone2')

  const [phone1, setPhone1] = useState<Phone | null>(null)
  const [phone2, setPhone2] = useState<Phone | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)

      if (!phone1Id && !phone2Id) {
        // Load defaults
        const [p1, p2] = await Promise.all(
          DEFAULT_PHONE_NAMES.map(fetchPhoneByName)
        )
        setPhone1(p1)
        setPhone2(p2)
      } else {
        const [p1, p2] = await Promise.all([
          phone1Id ? fetchPhoneById(phone1Id) : Promise.resolve(null),
          phone2Id ? fetchPhoneById(phone2Id) : Promise.resolve(null),
        ])
        setPhone1(p1)
        setPhone2(p2)
      }

      setLoading(false)
    }
    load()
  }, [phone1Id, phone2Id])

  function updateUrl(p1: Phone | null, p2: Phone | null) {
    const params = new URLSearchParams()
    if (p1) params.set('phone1', p1.id)
    if (p2) params.set('phone2', p2.id)
    router.replace(`/compare?${params.toString()}`)
  }

  function handlePhone1Select(phone: Phone) {
    setPhone1(phone)
    updateUrl(phone, phone2)
  }

  function handlePhone2Select(phone: Phone) {
    setPhone2(phone)
    updateUrl(phone1, phone)
  }

  const bothSelected = !!(phone1 && phone2)

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Navbar />

      <div className={`max-w-2xl mx-auto px-4 py-6 ${bothSelected ? 'pb-24' : ''}`}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Wapas jao
        </Link>

        <h1
          className="text-2xl font-black text-gray-900 mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Phone Compare karo
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Dono phones select karo - spec by spec comparison milegi
        </p>

        {/* Phone selectors */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone 1</p>
            <SearchBar
              onSelect={handlePhone1Select}
              selectedPhone={phone1}
              placeholder="Search phone..."
              excludeId={phone2?.id}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone 2</p>
            <SearchBar
              onSelect={handlePhone2Select}
              selectedPhone={phone2}
              placeholder="Doosra phone search karo"
              excludeId={phone1?.id}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin mx-auto" />
              <p className="text-sm text-gray-500">Phones load ho rahe hain...</p>
            </div>
          </div>
        )}

        {/* phone1 loaded, phone2 missing - show prominent prompt */}
        {!loading && phone1 && !phone2 && (
          <div className="mt-2">
            {/* Show phone1 mini card so user knows it's selected */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-[#FF6B00]/30 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center text-xs font-black text-[#FF6B00] flex-shrink-0">
                {phone1.brand.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{phone1.name}</p>
                <p className="text-sm text-[#FF6B00] font-semibold">Rs.{phone1.price_inr.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="text-center py-8 bg-white rounded-3xl border-2 border-dashed border-[#FF6B00]/40">
              <span className="text-4xl mb-3 block">📱</span>
              <p className="font-bold text-gray-800 text-base mb-1">Doosra phone select karo!</p>
              <p className="text-sm text-gray-400 mb-4">Upar "Phone 2" search bar mein dhundo</p>
              <div className="flex items-center gap-2 justify-center text-[#FF6B00] text-sm font-semibold animate-bounce">
                <span>Upar dekho</span>
                <span>↑</span>
              </div>
            </div>
          </div>
        )}

        {/* Both phones selected - show comparison */}
        {!loading && phone1 && phone2 && (
          <div className="space-y-5">
            <CompareTable phone1={phone1} phone2={phone2} />

            {/* Priya upsell - right after table, impossible to miss */}
            <PriyaUpsell phone1={phone1} phone2={phone2} />
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      {bothSelected && phone1 && phone2 && (
        <StickyCompareBar phone1={phone1} phone2={phone2} />
      )}
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    }>
      <CompareContent />
    </Suspense>
  )
}
