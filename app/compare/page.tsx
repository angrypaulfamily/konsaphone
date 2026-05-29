'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import CompareTable from '@/components/CompareTable'
import PriyaUpsell from '@/components/PriyaUpsell'
import { Phone } from '@/types'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function CompareContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone1Id = searchParams.get('phone1')
  const phone2Id = searchParams.get('phone2')

  const [phone1, setPhone1] = useState<Phone | null>(null)
  const [phone2, setPhone2] = useState<Phone | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchPhone(id: string): Promise<Phone | null> {
    const res = await fetch(`/api/phones?id=${id}`)
    const data = await res.json()
    return data.phone || null
  }

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [p1, p2] = await Promise.all([
        phone1Id ? fetchPhone(phone1Id) : Promise.resolve(null),
        phone2Id ? fetchPhone(phone2Id) : Promise.resolve(null),
      ])
      setPhone1(p1)
      setPhone2(p2)
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

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back link */}
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
          Dono phones select karo — spec by spec comparison milegi
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
              placeholder="Search phone..."
              excludeId={phone1?.id}
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin mx-auto" />
              <p className="text-sm text-gray-500">Phones load ho rahe hain...</p>
            </div>
          </div>
        )}

        {/* Prompt to select phones */}
        {!loading && (!phone1 || !phone2) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <p className="font-semibold text-gray-700">
              {!phone1 && !phone2
                ? 'Dono phones select karo compare karne ke liye'
                : !phone1
                ? 'Pehla phone select karo'
                : 'Doosra phone select karo'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Upar search bar mein phone ka naam type karo
            </p>
          </div>
        )}

        {/* Compare table */}
        {!loading && phone1 && phone2 && (
          <div className="space-y-6">
            <CompareTable phone1={phone1} phone2={phone2} />

            {/* Priya upsell */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 px-2">Ab kya?</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <PriyaUpsell phone1={phone1} phone2={phone2} />
            </div>
          </div>
        )}
      </div>
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
