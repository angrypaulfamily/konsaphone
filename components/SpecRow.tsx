import { Trophy } from 'lucide-react'

interface SpecRowProps {
  label: string
  icon?: React.ReactNode
  value1: string
  value2: string
  plain1?: string
  plain2?: string
  winner: 1 | 2 | 0
  highlight?: boolean
}

export default function SpecRow({
  label,
  icon,
  value1,
  value2,
  plain1,
  plain2,
  winner,
  highlight = false,
}: SpecRowProps) {
  return (
    <div className={`${highlight ? 'bg-orange-50/60' : 'bg-white'} rounded-xl overflow-hidden`}>
      {/* Spec label */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
        {icon && <span className="text-gray-500">{icon}</span>}
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</span>
      </div>

      {/* Values row */}
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        {/* Phone 1 */}
        <div className={`p-4 relative ${winner === 1 ? 'bg-orange-50' : ''}`}>
          {winner === 1 && (
            <div className="absolute top-2 right-2">
              <Trophy className="w-3.5 h-3.5 text-[#FF6B00]" />
            </div>
          )}
          <p className={`font-bold text-sm ${winner === 1 ? 'text-[#FF6B00]' : 'text-gray-700'}`}>
            {value1}
          </p>
          {plain1 && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{plain1}</p>
          )}
        </div>

        {/* Phone 2 */}
        <div className={`p-4 relative ${winner === 2 ? 'bg-orange-50' : ''}`}>
          {winner === 2 && (
            <div className="absolute top-2 right-2">
              <Trophy className="w-3.5 h-3.5 text-[#FF6B00]" />
            </div>
          )}
          <p className={`font-bold text-sm ${winner === 2 ? 'text-[#FF6B00]' : 'text-gray-700'}`}>
            {value2}
          </p>
          {plain2 && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{plain2}</p>
          )}
        </div>
      </div>
    </div>
  )
}
