import { supabase } from '@/lib/supabase'
import { Phone } from '@/types'
import PhoneCard from './PhoneCard'
import { TrendingUp } from 'lucide-react'

async function getPopularPhones(): Promise<Phone[]> {
  const { data, error } = await supabase
    .from('phones')
    .select('*')
    .order('price_inr', { ascending: true })
    .limit(6)

  if (error || !data) return []
  return data as Phone[]
}

export default async function PopularPhones() {
  const phones = await getPopularPhones()

  if (phones.length === 0) return null

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#FF6B00]" />
        <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
          Popular Phones
        </h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          India mein hot hai
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {phones.map((phone) => (
          <PhoneCard key={phone.id} phone={phone} />
        ))}
      </div>
    </section>
  )
}
