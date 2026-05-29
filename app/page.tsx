import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'
import PriceBrowse from '@/components/PriceBrowse'
import HomeSearch from '@/components/HomeSearch'
import { Smartphone, Zap, Trophy } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#1B4FD8]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-[#FF6B00] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Zap className="w-3.5 h-3.5" />
            India ka #1 Phone Comparison App
          </div>

          <h1
            className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-[#FF6B00]">Konsa</span>Phone?
            <br />
            <span className="gradient-text">Ab Pata Chalega.</span>
          </h1>

          <p className="text-gray-500 text-sm mb-8 max-w-sm">
            2 phones compare karo side by side. Priya aapko bata degi - kaunsa lena chahiye aur kyun.
          </p>

          <HomeSearch />

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: <Smartphone className="w-4 h-4" />, text: 'Phone search karo', color: 'text-[#FF6B00] bg-orange-100' },
              { icon: <Trophy className="w-4 h-4" />, text: 'Side by side compare', color: 'text-[#1B4FD8] bg-blue-100' },
              { icon: <Zap className="w-4 h-4" />, text: "Priya ka verdict lo", color: 'text-[#16A34A] bg-green-100' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className={`w-9 h-9 rounded-xl ${step.color} flex items-center justify-center mx-auto mb-1.5`}>
                  {step.icon}
                </div>
                <p className="text-xs text-gray-600 leading-tight">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <PriceBrowse />
      </div>
    </div>
  )
}
