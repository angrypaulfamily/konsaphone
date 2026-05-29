'use client'

import { useState } from 'react'
import PriyaAvatar from './PriyaAvatar'
import { AlternativePhone } from '@/types'
import { ExternalLink, Trophy, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'

interface PriyaVerdictProps {
  verdictText: string
  tier: 49 | 99
  alternatives?: AlternativePhone[]
}

export default function PriyaVerdict({ verdictText, tier, alternatives }: PriyaVerdictProps) {
  const [showAlts, setShowAlts] = useState(false)

  const paragraphs = verdictText.split('\n').filter((p) => p.trim())

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Priya says */}
      <div className="flex items-center gap-2">
        <PriyaAvatar size="sm" />
        <div>
          <p className="font-bold text-sm text-gray-900">Priya ka verdict</p>
          <p className="text-xs text-[#16A34A] font-medium">Confirmed</p>
        </div>
      </div>

      {/* Verdict content - bold and direct */}
      <div className="space-y-3">
        {paragraphs.map((para, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-800 leading-relaxed">{para}</p>
          </div>
        ))}
      </div>

      {/* Rs.99 alternatives */}
      {tier === 99 && alternatives && alternatives.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowAlts(!showAlts)}
            className="w-full flex items-center justify-between p-4 bg-[#1B4FD8] text-white rounded-2xl font-semibold text-sm"
          >
            <span>Priya ki Ranked List ({alternatives.length} phones)</span>
            {showAlts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAlts && (
            <div className="mt-2 space-y-2">
              {alternatives.map((alt) => (
                <div key={alt.rank} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      alt.rank === 1 ? 'bg-[#FF6B00] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {alt.rank === 1 ? <Trophy className="w-4 h-4" /> : alt.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900">{alt.phone_name}</p>
                      {alt.price_inr > 0 && (
                        <p className="text-xs text-[#FF6B00] font-semibold">Rs.{alt.price_inr.toLocaleString('en-IN')}</p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">{alt.reason}</p>
                      <div className="flex gap-2 mt-2">
                        {alt.flipkart_url && (
                          <a href={alt.flipkart_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-semibold text-white bg-[#FF6161] px-3 py-1.5 rounded-lg">
                            Flipkart <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {alt.amazon_url && (
                          <a href={alt.amazon_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-semibold text-white bg-[#FF9900] px-3 py-1.5 rounded-lg">
                            Amazon <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
