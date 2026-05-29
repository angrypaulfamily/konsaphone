'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Phone } from '@/types'
import { Search, X, ArrowRight, Loader2 } from 'lucide-react'

function PhoneInput({
  label,
  selected,
  onSelect,
  excludeId,
  placeholder,
}: {
  label: string
  selected: Phone | null
  onSelect: (p: Phone | null) => void
  excludeId?: string
  placeholder: string
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Phone[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchPhones = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const url = q.length >= 2 ? `/api/phones?q=${encodeURIComponent(q)}` : '/api/phones'
      const res = await fetch(url)
      const data = await res.json()
      setResults(excludeId ? data.phones.filter((p: Phone) => p.id !== excludeId) : data.phones)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [excludeId])

  useEffect(() => {
    if (!open) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPhones(query), 250)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, open, fetchPhones])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(phone: Phone) {
    onSelect(phone)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>

      {selected ? (
        <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border-2 border-[#FF6B00] shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-black text-[#FF6B00] flex-shrink-0">
            {selected.brand.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 truncate">{selected.name}</p>
            <p className="text-xs text-gray-500">Rs.{selected.price_inr.toLocaleString('en-IN')}</p>
          </div>
          <button onClick={() => onSelect(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border-2 border-gray-200 focus-within:border-[#FF6B00] transition-colors shadow-sm">
          {loading ? (
            <Loader2 className="w-4 h-4 text-[#FF6B00] animate-spin flex-shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setOpen(true); if (results.length === 0) fetchPhones('') }}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            autoComplete="off"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {open && !selected && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
          {loading && results.length === 0 && (
            <div className="flex items-center justify-center py-5 gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          )}
          {results.map((phone) => (
            <button
              key={phone.id}
              onClick={() => handleSelect(phone)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left border-b border-gray-50 last:border-0"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-[#FF6B00] flex-shrink-0">
                {phone.brand.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{phone.name}</p>
                <p className="text-xs text-gray-500">Rs.{phone.price_inr.toLocaleString('en-IN')} · {phone.ram_gb}GB · {phone.camera_mp}MP</p>
              </div>
              {phone.has_5g && (
                <span className="text-xs font-bold text-[#1B4FD8] bg-blue-50 px-1.5 py-0.5 rounded flex-shrink-0">5G</span>
              )}
            </button>
          ))}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="px-4 py-5 text-center text-sm text-gray-400">
              Koi phone nahi mila &quot;{query}&quot; ke liye
            </div>
          )}
        </div>
      )}
    </div>
  )
}

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
      <div className="flex gap-3 items-start">
        <PhoneInput
          label="Phone 1"
          selected={phone1}
          onSelect={(p) => setPhone1(p)}
          excludeId={phone2?.id}
          placeholder="Pehla phone dhundo..."
        />

        <div className="flex-shrink-0 mt-6 text-xs font-black text-gray-400 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
          VS
        </div>

        <PhoneInput
          label="Phone 2"
          selected={phone2}
          onSelect={(p) => setPhone2(p)}
          excludeId={phone1?.id}
          placeholder="Doosra phone dhundo..."
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
