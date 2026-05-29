'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Phone } from '@/types'

interface SearchBarProps {
  onSelect: (phone: Phone) => void
  placeholder?: string
  excludeId?: string
  selectedPhone?: Phone | null
}

export default function SearchBar({
  onSelect,
  placeholder = 'Phone search karo... (e.g. Redmi Note 13)',
  excludeId,
  selectedPhone,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Phone[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setResults([])
        setOpen(false)
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/phones?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        const filtered = excludeId
          ? data.phones.filter((p: Phone) => p.id !== excludeId)
          : data.phones
        setResults(filtered)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    },
    [excludeId]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

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

  function clearSelection() {
    onSelect(null as unknown as Phone)
    setQuery('')
    inputRef.current?.focus()
  }

  if (selectedPhone) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-[#FF6B00] shadow-sm">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{selectedPhone.name}</p>
          <p className="text-sm text-gray-500">
            ₹{selectedPhone.price_inr.toLocaleString('en-IN')} · {selectedPhone.brand}
          </p>
        </div>
        <button
          onClick={clearSelection}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border-2 border-gray-200 focus-within:border-[#FF6B00] transition-colors shadow-sm">
        {loading ? (
          <Loader2 className="w-4 h-4 text-[#FF6B00] animate-spin flex-shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
          autoComplete="off"
          autoCorrect="off"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-72 overflow-y-auto">
          {results.map((phone) => (
            <button
              key={phone.id}
              onClick={() => handleSelect(phone)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left border-b border-gray-50 last:border-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center text-xs font-bold text-[#FF6B00] flex-shrink-0">
                {phone.brand.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{phone.name}</p>
                <p className="text-xs text-gray-500">
                  ₹{phone.price_inr.toLocaleString('en-IN')} · {phone.ram_gb}GB RAM · {phone.camera_mp}MP
                </p>
              </div>
              {phone.has_5g && (
                <span className="text-xs font-bold text-[#1B4FD8] bg-blue-50 px-1.5 py-0.5 rounded flex-shrink-0">
                  5G
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 px-4 py-6 text-center">
          <p className="text-sm text-gray-500">Koi phone nahi mila &quot;{query}&quot; ke liye</p>
          <p className="text-xs text-gray-400 mt-1">Try karo: brand name ya model number</p>
        </div>
      )}
    </div>
  )
}
