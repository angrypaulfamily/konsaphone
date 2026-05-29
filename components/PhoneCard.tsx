import Link from 'next/link'
import { Phone } from '@/types'
import { Zap, Camera, Battery, Cpu } from 'lucide-react'

interface PhoneCardProps {
  phone: Phone
  compact?: boolean
}

export default function PhoneCard({ phone, compact = false }: PhoneCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#FF6B00] to-[#1B4FD8]" />

      <div className="p-4">
        {/* Brand + 5G badge */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[#FF6B00] uppercase tracking-wide">
            {phone.brand}
          </span>
          {phone.has_5g && (
            <span className="text-xs font-bold text-white bg-[#1B4FD8] px-2 py-0.5 rounded-full">
              5G
            </span>
          )}
        </div>

        {/* Phone name */}
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{phone.name}</h3>

        {/* Price */}
        <p className="text-xl font-extrabold text-[#FF6B00] mb-3">
          ₹{phone.price_inr.toLocaleString('en-IN')}
        </p>

        {!compact && (
          <>
            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Camera className="w-3.5 h-3.5 text-purple-500" />
                <span>{phone.camera_mp}MP</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Battery className="w-3.5 h-3.5 text-green-500" />
                <span>{phone.battery_mah}mAh</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Cpu className="w-3.5 h-3.5 text-blue-500" />
                <span>{phone.ram_gb}GB RAM</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>{phone.charging_w}W</span>
              </div>
            </div>

            {/* Best for tag */}
            {phone.best_for && (
              <div className="mb-3">
                <span className="text-xs bg-orange-50 text-[#FF6B00] px-2 py-1 rounded-full font-medium">
                  Best for: {phone.best_for}
                </span>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <Link
          href={`/compare?phone1=${phone.id}`}
          className="block w-full text-center text-sm font-semibold bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          Compare karo →
        </Link>
      </div>
    </div>
  )
}
