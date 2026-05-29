import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
import Navbar from '@/components/Navbar'
import PriyaVerdict from '@/components/PriyaVerdict'
import PriyaAvatar from '@/components/PriyaAvatar'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Phone, AlternativePhone } from '@/types'
import ShareButton from '@/components/ShareButton'

interface ResultPageProps {
  params: Promise<{ verdictId: string }>
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { verdictId } = await params

  const { data: verdict, error } = await supabaseAdmin
    .from('verdicts')
    .select(`
      *,
      orders (
        tier,
        phone_ids
      )
    `)
    .eq('id', verdictId)
    .single()

  if (error || !verdict) notFound()

  const order = verdict.orders as { tier: 49 | 99; phone_ids: string[] }

  // Fetch phone details for context display
  let phones: Phone[] = []
  if (order.phone_ids?.length) {
    const { data } = await supabaseAdmin
      .from('phones')
      .select('*')
      .in('id', order.phone_ids)
    phones = (data as Phone[]) || []
  }

  // Enrich alternatives with phone data
  let alternatives: AlternativePhone[] | undefined
  if (verdict.alternatives && phones.length) {
    alternatives = (verdict.alternatives as AlternativePhone[]).map((alt) => {
      const phone = phones.find(
        (p) => p.id === alt.phone_id || p.name.toLowerCase().includes(alt.phone_name?.toLowerCase())
      )
      return {
        ...alt,
        flipkart_url: phone?.flipkart_url || null,
        amazon_url: phone?.amazon_url || null,
        price_inr: phone?.price_inr || alt.price_inr || 0,
      }
    })
  }

  const useCase = (verdict.answers as { use_case: string })?.use_case
  const useCaseLabel: Record<string, string> = {
    gaming: '🎮 Gaming',
    camera: '📸 Camera',
    daily: '📱 Roz ka kaam',
    everything: '⚡ Sab kuch',
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Wapas Home
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-orange-500 rounded-3xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <PriyaAvatar size="md" />
            <div>
              <p className="text-white font-bold text-lg">Priya ka Verdict</p>
              <p className="text-orange-100 text-xs">
                {order.tier === 99 ? 'Full Analysis' : "Priya's Pick"} ·{' '}
                {useCase ? useCaseLabel[useCase] : ''} ke liye
              </p>
            </div>
          </div>

          {/* Phones compared */}
          {phones.length >= 2 && (
            <div className="flex items-center gap-2 mt-2">
              {phones.map((p, i) => (
                <div key={p.id} className="flex items-center gap-1">
                  {i > 0 && <span className="text-orange-200 text-xs font-bold">vs</span>}
                  <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verdict */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
          <PriyaVerdict
            verdictText={verdict.verdict_text}
            tier={order.tier}
            alternatives={alternatives}
          />
        </div>

        {/* Buy links for compared phones */}
        {phones.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-600">Kharido yahan se:</p>
            {phones.map((phone) => (
              <div key={phone.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="font-semibold text-sm text-gray-900 mb-2">{phone.name}</p>
                <div className="flex gap-2">
                  {phone.flipkart_url && (
                    <a
                      href={phone.flipkart_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs font-bold text-white bg-[#FF6161] py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Flipkart pe dekho
                    </a>
                  )}
                  {phone.amazon_url && (
                    <a
                      href={phone.amazon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs font-bold text-white bg-[#FF9900] py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Amazon pe dekho
                    </a>
                  )}
                  {!phone.flipkart_url && !phone.amazon_url && (
                    <p className="text-xs text-gray-400">Links available nahi hain</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="flex-1 text-center py-3 rounded-2xl border-2 border-[#FF6B00] text-[#FF6B00] font-semibold text-sm hover:bg-orange-50 transition-colors"
          >
            Aur phones compare karo
          </Link>
          <ShareButton />
        </div>
      </div>
    </div>
  )
}
