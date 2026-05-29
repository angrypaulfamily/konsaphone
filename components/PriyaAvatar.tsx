interface PriyaAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function PriyaAvatar({ size = 'md', animated = false }: PriyaAvatarProps) {
  const sizes = { sm: 40, md: 56, lg: 80 }
  const px = sizes[size]

  return (
    <div
      className={`relative rounded-full flex-shrink-0 ${animated ? 'animate-pulse-orange' : ''}`}
      style={{ width: px, height: px }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="40" cy="40" r="40" fill="url(#priyaBg)" />

        {/* Skin */}
        <circle cx="40" cy="32" r="14" fill="#D4956A" />
        {/* Neck */}
        <rect x="35" y="44" width="10" height="8" rx="3" fill="#D4956A" />
        {/* Body / saree top */}
        <path d="M18 72 Q18 54 40 54 Q62 54 62 72 Z" fill="#FF6B00" />
        {/* Saree drape accent */}
        <path d="M18 72 Q25 60 35 56" stroke="#1B4FD8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Hair */}
        <path
          d="M26 30 Q26 16 40 16 Q54 16 54 30 Q54 22 40 20 Q26 20 26 30Z"
          fill="#1a1a1a"
        />
        {/* Bindi */}
        <circle cx="40" cy="24" r="1.5" fill="#FF6B00" />

        {/* Eyes */}
        <ellipse cx="35" cy="31" rx="2.5" ry="2" fill="#1a1a1a" />
        <ellipse cx="45" cy="31" rx="2.5" ry="2" fill="#1a1a1a" />
        <circle cx="35.8" cy="30.5" r="0.7" fill="white" />
        <circle cx="45.8" cy="30.5" r="0.7" fill="white" />

        {/* Smile */}
        <path d="M36 37 Q40 41 44 37" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Earrings */}
        <circle cx="26" cy="34" r="2" fill="#FF6B00" />
        <circle cx="54" cy="34" r="2" fill="#FF6B00" />

        <defs>
          <linearGradient id="priyaBg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF3E0" />
            <stop offset="100%" stopColor="#FFE0B2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Online indicator */}
      {animated && (
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  )
}
