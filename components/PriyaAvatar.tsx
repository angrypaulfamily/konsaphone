interface PriyaAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function PriyaAvatar({ size = 'md', animated = false }: PriyaAvatarProps) {
  const sizes = { sm: 40, md: 56, lg: 88 }
  const px = sizes[size]

  return (
    <div
      className={`relative rounded-full flex-shrink-0 ${animated ? 'animate-pulse-orange' : ''}`}
      style={{ width: px, height: px }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF0E6" />
            <stop offset="100%" stopColor="#FFD6B0" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2C1810" />
            <stop offset="100%" stopColor="#4A2818" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="30" y1="20" x2="70" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C8784A" />
            <stop offset="100%" stopColor="#B5643A" />
          </linearGradient>
          <linearGradient id="dressGrad" x1="0" y1="60" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#E55A00" />
          </linearGradient>
          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8C69" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF8C69" stopOpacity="0" />
          </radialGradient>
          <clipPath id="circle">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>

        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="url(#bgGrad)" />

        <g clipPath="url(#circle)">
          {/* Shoulders / outfit */}
          <path d="M10 100 Q15 72 35 68 Q42 66 50 66 Q58 66 65 68 Q85 72 90 100 Z" fill="url(#dressGrad)" />
          {/* Saree/dupatta drape detail */}
          <path d="M10 100 Q18 78 30 70" stroke="#FF8C00" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M14 100 Q22 80 33 72" stroke="#FFB347" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>

          {/* Neck */}
          <path d="M44 62 Q44 68 50 69 Q56 68 56 62 L54 57 Q50 59 46 57 Z" fill="url(#skinGrad)" />

          {/* Hair - back layer */}
          <ellipse cx="50" cy="34" rx="22" ry="24" fill="url(#hairGrad)" />
          {/* Long hair sides */}
          <path d="M28 38 Q24 55 26 72 Q30 68 33 65 Q31 52 32 40 Z" fill="url(#hairGrad)" />
          <path d="M72 38 Q76 55 74 72 Q70 68 67 65 Q69 52 68 40 Z" fill="url(#hairGrad)" />

          {/* Face */}
          <ellipse cx="50" cy="38" rx="18" ry="20" fill="url(#skinGrad)" />

          {/* Hair - front/top */}
          <path d="M32 30 Q34 16 50 14 Q66 16 68 30 Q60 20 50 19 Q40 20 32 30 Z" fill="url(#hairGrad)" />
          {/* Hair highlight */}
          <path d="M38 17 Q50 13 60 17 Q55 14 50 13.5 Q45 14 38 17 Z" fill="#5C3320" opacity="0.6" />

          {/* Hair parting detail */}
          <path d="M50 14 L50 22" stroke="#1A0A06" strokeWidth="0.8" opacity="0.5" />

          {/* Cheek blush */}
          <ellipse cx="36" cy="42" rx="6" ry="4" fill="url(#cheekBlush)" />
          <ellipse cx="64" cy="42" rx="6" ry="4" fill="url(#cheekBlush)" />

          {/* Eyebrows - arched */}
          <path d="M38 29 Q42 26.5 46 28" stroke="#2C1810" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M54 28 Q58 26.5 62 29" stroke="#2C1810" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Eyes - almond shaped */}
          <path d="M37 34 Q42 31 47 34 Q42 37 37 34 Z" fill="white" />
          <path d="M53 34 Q58 31 63 34 Q58 37 53 34 Z" fill="white" />

          {/* Irises */}
          <ellipse cx="42" cy="34" rx="3.2" ry="3" fill="#3D1F0A" />
          <ellipse cx="58" cy="34" rx="3.2" ry="3" fill="#3D1F0A" />

          {/* Pupils */}
          <ellipse cx="42" cy="34" rx="1.8" ry="1.8" fill="#0D0604" />
          <ellipse cx="58" cy="34" rx="1.8" ry="1.8" fill="#0D0604" />

          {/* Eye shine */}
          <circle cx="43.2" cy="33" r="0.9" fill="white" />
          <circle cx="59.2" cy="33" r="0.9" fill="white" />

          {/* Eyeliner flick */}
          <path d="M37 34 Q35.5 33.5 35 32.5" stroke="#1A0A06" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M63 34 Q64.5 33.5 65 32.5" stroke="#1A0A06" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Eyelashes top */}
          <path d="M37 33 Q42 30.5 47 33" stroke="#1A0A06" strokeWidth="1.2" fill="none" />
          <path d="M53 33 Q58 30.5 63 33" stroke="#1A0A06" strokeWidth="1.2" fill="none" />

          {/* Nose - subtle */}
          <path d="M49 38 Q48 42 46 44 Q49 45 52 44 Q54 42 51 38" stroke="#9B5B35" strokeWidth="0.9" fill="none" strokeLinecap="round" />

          {/* Lips - full and defined */}
          <path d="M43 49 Q46 47 50 47.5 Q54 47 57 49 Q54 47.5 50 48 Q46 47.5 43 49 Z" fill="#C0392B" />
          <path d="M43 49 Q46 51.5 50 52 Q54 51.5 57 49 Q54 53 50 53.5 Q46 53 43 49 Z" fill="#A93226" />
          <path d="M46 48 Q50 47 54 48" stroke="#E8524A" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.6" />

          {/* Bindi */}
          <circle cx="50" cy="26" r="2.2" fill="#FF6B00" />
          <circle cx="50" cy="26" r="1.2" fill="#FF3300" />

          {/* Earrings - gold jhumka */}
          <circle cx="31.5" cy="41" r="3" fill="#FFD700" />
          <circle cx="31.5" cy="41" r="1.8" fill="#FFA500" />
          <path d="M29.5 44 Q31.5 49 33.5 44" stroke="#FFD700" strokeWidth="1.5" fill="none" />

          <circle cx="68.5" cy="41" r="3" fill="#FFD700" />
          <circle cx="68.5" cy="41" r="1.8" fill="#FFA500" />
          <path d="M66.5 44 Q68.5 49 70.5 44" stroke="#FFD700" strokeWidth="1.5" fill="none" />

          {/* Necklace hint */}
          <path d="M42 63 Q50 67 58 63" stroke="#FFD700" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* Subtle border */}
        <circle cx="50" cy="50" r="49" stroke="#FFD6B0" strokeWidth="1" fill="none" />
      </svg>

      {animated && (
        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
      )}
    </div>
  )
}
