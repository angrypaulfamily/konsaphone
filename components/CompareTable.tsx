import { Phone } from '@/types'
import SpecRow from './SpecRow'
import { Camera, Battery, Cpu, Monitor, Zap, Signal, HardDrive, Layers, Shield, Weight, MemoryStick, RefreshCcw, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

interface CompareTableProps {
  phone1: Phone
  phone2: Phone
}

function formatBool(val: boolean) {
  return val ? 'Yes ✓' : 'No ✗'
}

function winnerByHigher(a: number, b: number): 1 | 2 | 0 {
  if (a > b) return 1
  if (b > a) return 2
  return 0
}

function winnerByLower(a: number, b: number): 1 | 2 | 0 {
  if (a < b) return 1
  if (b < a) return 2
  return 0
}

function parseIPNum(ip: string | null): number {
  if (!ip) return 0
  const m = ip.match(/IP(\d+)/)
  return m ? parseInt(m[1]) : 0
}

function SentimentBadge({ sentiment }: { sentiment: string | null }) {
  if (!sentiment) return null
  const styles: Record<string, string> = {
    positive: 'bg-green-100 text-green-700',
    mixed: 'bg-amber-100 text-amber-700',
    negative: 'bg-red-100 text-red-700',
  }
  const labels: Record<string, string> = {
    positive: 'Positive',
    mixed: 'Mixed',
    negative: 'Negative',
  }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[sentiment] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[sentiment] ?? sentiment}
    </span>
  )
}

function PhoneHeader({ phone, isWinner }: { phone: Phone; isWinner: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center border-2 ${isWinner ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 bg-white'}`}>
      {phone.image_url ? (
        <img
          src={phone.image_url}
          alt={phone.name}
          className="w-14 h-14 object-contain mx-auto mb-1"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-sm font-black text-[#FF6B00] mx-auto mb-1">
          {phone.brand.slice(0, 2).toUpperCase()}
        </div>
      )}
      <p className="text-xs font-semibold text-gray-500 uppercase">{phone.brand}</p>
      <p className="font-bold text-sm text-gray-900 leading-tight">{phone.name}</p>
      <p className="text-[#FF6B00] font-bold text-sm mt-1">
        ₹{phone.price_inr.toLocaleString('en-IN')}
      </p>
      {isWinner && (
        <div className="mt-1.5 text-xs font-bold text-white bg-[#FF6B00] rounded-full px-2 py-0.5 inline-block">
          Winner 🏆
        </div>
      )}
    </div>
  )
}

export default function CompareTable({ phone1, phone2 }: CompareTableProps) {
  const specs = [
    {
      label: 'Camera',
      icon: <Camera className="w-4 h-4" />,
      value1: `${phone1.camera_mp}MP + ${phone1.front_camera_mp}MP front`,
      value2: `${phone2.camera_mp}MP + ${phone2.front_camera_mp}MP front`,
      plain1: phone1.plain_camera_verdict ?? undefined,
      plain2: phone2.plain_camera_verdict ?? undefined,
      winner: winnerByHigher(phone1.camera_mp, phone2.camera_mp),
      highlight: true,
    },
    {
      label: 'Battery',
      icon: <Battery className="w-4 h-4" />,
      value1: `${phone1.battery_mah}mAh`,
      value2: `${phone2.battery_mah}mAh`,
      plain1: phone1.plain_battery_verdict ?? undefined,
      plain2: phone2.plain_battery_verdict ?? undefined,
      winner: winnerByHigher(phone1.battery_mah, phone2.battery_mah),
    },
    {
      label: 'Fast Charging',
      icon: <Zap className="w-4 h-4" />,
      value1: `${phone1.charging_w}W`,
      value2: `${phone2.charging_w}W`,
      plain1: `0-100% in ~${Math.round(5000 / phone1.charging_w)}-${Math.round(6000 / phone1.charging_w)} min`,
      plain2: `0-100% in ~${Math.round(5000 / phone2.charging_w)}-${Math.round(6000 / phone2.charging_w)} min`,
      winner: winnerByHigher(phone1.charging_w, phone2.charging_w),
    },
    {
      label: 'Processor',
      icon: <Cpu className="w-4 h-4" />,
      value1: phone1.processor,
      value2: phone2.processor,
      plain1: phone1.plain_gaming_verdict ?? undefined,
      plain2: phone2.plain_gaming_verdict ?? undefined,
      winner: 0 as const,
      highlight: true,
    },
    {
      label: 'RAM',
      icon: <Layers className="w-4 h-4" />,
      value1: `${phone1.ram_gb}GB RAM`,
      value2: `${phone2.ram_gb}GB RAM`,
      plain1: phone1.ram_gb >= 8 ? 'No lag switching apps' : 'Basic multitasking',
      plain2: phone2.ram_gb >= 8 ? 'No lag switching apps' : 'Basic multitasking',
      winner: winnerByHigher(phone1.ram_gb, phone2.ram_gb),
    },
    {
      label: 'Storage',
      icon: <HardDrive className="w-4 h-4" />,
      value1: `${phone1.storage_gb}GB`,
      value2: `${phone2.storage_gb}GB`,
      plain1: `~${Math.round(phone1.storage_gb * 117)} photos`,
      plain2: `~${Math.round(phone2.storage_gb * 117)} photos`,
      winner: winnerByHigher(phone1.storage_gb, phone2.storage_gb),
    },
    {
      label: 'MicroSD',
      icon: <MemoryStick className="w-4 h-4" />,
      value1: phone1.card_slot ?? 'Unknown',
      value2: phone2.card_slot ?? 'Unknown',
      winner:
        phone1.card_slot === phone2.card_slot
          ? (0 as const)
          : phone1.card_slot === 'Yes'
          ? (1 as const)
          : (2 as const),
    },
    {
      label: 'Display',
      icon: <Monitor className="w-4 h-4" />,
      value1: `${phone1.display_size_inch}" ${phone1.display_type} ${phone1.display_hz}Hz`,
      value2: `${phone2.display_size_inch}" ${phone2.display_type} ${phone2.display_hz}Hz`,
      plain1: (() => {
        const isAmoled = /amoled|oled/i.test(phone1.display_type)
        const smooth = phone1.display_hz >= 120 ? 'butter smooth scrolling' : phone1.display_hz >= 90 ? 'smooth scrolling' : 'standard 60fps'
        return isAmoled
          ? `AMOLED - vibrant colours, deep blacks, great for reels. ${phone1.display_hz}Hz ${smooth}.`
          : smooth.charAt(0).toUpperCase() + smooth.slice(1)
      })(),
      plain2: (() => {
        const isAmoled = /amoled|oled/i.test(phone2.display_type)
        const smooth = phone2.display_hz >= 120 ? 'butter smooth scrolling' : phone2.display_hz >= 90 ? 'smooth scrolling' : 'standard 60fps'
        return isAmoled
          ? `AMOLED - vibrant colours, deep blacks, great for reels. ${phone2.display_hz}Hz ${smooth}.`
          : smooth.charAt(0).toUpperCase() + smooth.slice(1)
      })(),
      winner: winnerByHigher(phone1.display_hz, phone2.display_hz),
      highlight: true,
    },
    {
      label: '5G',
      icon: <Signal className="w-4 h-4" />,
      value1: formatBool(phone1.has_5g),
      value2: formatBool(phone2.has_5g),
      winner:
        phone1.has_5g === phone2.has_5g
          ? (0 as const)
          : phone1.has_5g
          ? (1 as const)
          : (2 as const),
    },
    {
      label: 'Weight',
      icon: <Weight className="w-4 h-4" />,
      value1: phone1.weight_g ? `${phone1.weight_g}g` : 'N/A',
      value2: phone2.weight_g ? `${phone2.weight_g}g` : 'N/A',
      plain1: phone1.weight_g ? (phone1.weight_g < 175 ? 'Light - comfortable all day' : phone1.weight_g < 200 ? 'Average weight' : 'Heavy - notice it in pocket') : undefined,
      plain2: phone2.weight_g ? (phone2.weight_g < 175 ? 'Light - comfortable all day' : phone2.weight_g < 200 ? 'Average weight' : 'Heavy - notice it in pocket') : undefined,
      winner: phone1.weight_g && phone2.weight_g ? winnerByLower(phone1.weight_g, phone2.weight_g) : (0 as const),
    },
    {
      label: 'IP Rating',
      icon: <Shield className="w-4 h-4" />,
      value1: phone1.ip_rating ?? 'None',
      value2: phone2.ip_rating ?? 'None',
      plain1: phone1.ip_rating === 'IP68' ? 'Fully waterproof - barish mein safe' : phone1.ip_rating?.startsWith('IP5') ? 'Splash resistant only' : 'No water protection',
      plain2: phone2.ip_rating === 'IP68' ? 'Fully waterproof - barish mein safe' : phone2.ip_rating?.startsWith('IP5') ? 'Splash resistant only' : 'No water protection',
      winner: winnerByHigher(parseIPNum(phone1.ip_rating), parseIPNum(phone2.ip_rating)),
    },
    {
      label: 'Software Updates',
      icon: <RefreshCcw className="w-4 h-4" />,
      value1: phone1.sw_label ?? 'Unknown',
      value2: phone2.sw_label ?? 'Unknown',
      plain1: phone1.sw_until_year ? `Updates milenge until ${phone1.sw_until_year}` : undefined,
      plain2: phone2.sw_until_year ? `Updates milenge until ${phone2.sw_until_year}` : undefined,
      winner: phone1.sw_until_year && phone2.sw_until_year ? winnerByHigher(phone1.sw_until_year, phone2.sw_until_year) : (0 as const),
      highlight: true,
    },
    {
      label: 'Price',
      icon: null,
      value1: `₹${phone1.price_inr.toLocaleString('en-IN')}`,
      value2: `₹${phone2.price_inr.toLocaleString('en-IN')}`,
      plain1: phone1.price_inr < phone2.price_inr ? `₹${(phone2.price_inr - phone1.price_inr).toLocaleString('en-IN')} sasta` : undefined,
      plain2: phone2.price_inr < phone1.price_inr ? `₹${(phone1.price_inr - phone2.price_inr).toLocaleString('en-IN')} sasta` : undefined,
      winner: winnerByLower(phone1.price_inr, phone2.price_inr),
    },
  ]

  const wins1 = specs.filter((s) => s.winner === 1).length
  const wins2 = specs.filter((s) => s.winner === 2).length
  const overallWinner = wins1 > wins2 ? 1 : wins2 > wins1 ? 2 : 0

  const hasReddit = phone1.reddit_praise || phone1.reddit_complaints || phone2.reddit_praise || phone2.reddit_complaints

  return (
    <div>
      {/* Sticky phone headers with images */}
      <div className="grid grid-cols-2 gap-2 mb-3 sticky top-14 z-10 bg-[#FFFBF5] py-2">
        <PhoneHeader phone={phone1} isWinner={overallWinner === 1} />
        <PhoneHeader phone={phone2} isWinner={overallWinner === 2} />
      </div>

      {/* Spec rows */}
      <div className="space-y-2">
        {specs.map((spec) => (
          <SpecRow
            key={spec.label}
            label={spec.label}
            icon={spec.icon}
            value1={spec.value1}
            value2={spec.value2}
            plain1={spec.plain1}
            plain2={spec.plain2}
            winner={spec.winner}
            highlight={spec.highlight}
          />
        ))}
      </div>

      {/* Reddit - Logon ki Raay */}
      {hasReddit && (
        <div className="mt-4 rounded-xl overflow-hidden border border-purple-100">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border-b border-purple-100">
            <MessageCircle className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Logon ki Raay</span>
            <span className="text-xs text-purple-400 ml-1">Reddit + Tech Community</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-purple-100 bg-white">
            {[phone1, phone2].map((phone) => (
              <div key={phone.id} className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <SentimentBadge sentiment={phone.reddit_sentiment} />
                </div>
                {phone.reddit_praise && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <ThumbsUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-semibold text-green-600">Log pasand karte hain</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{phone.reddit_praise}</p>
                  </div>
                )}
                {phone.reddit_complaints && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <ThumbsDown className="w-3 h-3 text-red-400" />
                      <span className="text-xs font-semibold text-red-500">Complaints</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{phone.reddit_complaints}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Win count summary */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[
          { phone: phone1, wins: wins1, idx: 1 },
          { phone: phone2, wins: wins2, idx: 2 },
        ].map(({ phone, wins, idx }) => (
          <div
            key={idx}
            className={`rounded-xl p-3 text-center border ${overallWinner === idx ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-100 bg-white'}`}
          >
            <p className="text-2xl font-black text-[#FF6B00]">{wins}</p>
            <p className="text-xs text-gray-500">categories jeetein</p>
            <p className="text-xs font-semibold text-gray-700 mt-0.5 truncate">{phone.name}</p>
          </div>
        ))}
      </div>

      {/* Verdict blurb */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#FF6B00]/10 to-[#1B4FD8]/10 border border-orange-200">
        <p className="text-sm font-semibold text-gray-800">
          {overallWinner === 0
            ? `${phone1.name} aur ${phone2.name} almost barabar hain - use case ke hisaab se decide karo!`
            : overallWinner === 1
            ? `Overall winner: ${phone1.name} - ${wins1} out of ${specs.length} specs mein aage hai.`
            : `Overall winner: ${phone2.name} - ${wins2} out of ${specs.length} specs mein aage hai.`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Lekin specs sirf ek picture hai - apna use case bhi matter karta hai!
        </p>
      </div>
    </div>
  )
}
