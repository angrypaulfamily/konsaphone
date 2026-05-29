import Groq from 'groq-sdk'
import { Phone, UserAnswers } from '@/types'

export function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY! })
}

export function buildPriyaPrompt(phones: Phone[], answers: UserAnswers, tier: 49 | 99): string {
  const phoneList = phones
    .map(
      (p, i) =>
        `Phone ${i + 1}: ${p.name}
  - Price: Rs.${p.price_inr.toLocaleString('en-IN')}
  - Processor: ${p.processor}
  - RAM: ${p.ram_gb}GB, Storage: ${p.storage_gb}GB
  - Battery: ${p.battery_mah}mAh, ${p.charging_w}W charging
  - Camera: ${p.camera_mp}MP main, ${p.front_camera_mp}MP front
  - Display: ${p.display_size_inch}" ${p.display_type} ${p.display_hz}Hz
  - 5G: ${p.has_5g ? 'Yes' : 'No'}
  - Best for: ${p.best_for || 'General use'}
  - Camera note: ${p.plain_camera_verdict || 'N/A'}
  - Battery note: ${p.plain_battery_verdict || 'N/A'}
  - Gaming note: ${p.plain_gaming_verdict || 'N/A'}`
    )
    .join('\n\n')

  const useCaseMap = {
    gaming: 'Gaming (BGMI, Free Fire)',
    camera: 'Photography and videos',
    daily: 'Daily use - calls, WhatsApp, YouTube',
    everything: 'Everything - gaming, camera, daily use',
  }
  const hoursMap = { '2-4': '2-4 hours/day', '4-7': '4-7 hours/day', '7+': '7+ hours/day' }
  const longevityMap = { '1-2': '1-2 years', '2-3': '2-3 years', '3+': '3+ years' }

  return `You are Priya - a confident, direct Indian friend who gives phone recommendations. Speak in Hinglish (Hindi + English mix). Be punchy and decisive - no fluff.

User wants the phone for: ${useCaseMap[answers.use_case]}
Daily usage: ${hoursMap[answers.usage_hours]}
Wants to keep it for: ${longevityMap[answers.longevity]}

Phones:
${phoneList}

Give a SHORT, DIRECT verdict in 3-4 sentences max. No intro, no fluff. Just:
1. Which phone to buy (be decisive)
2. One main reason why (specific to their use case)
3. One honest watch-out

${tier === 99 ? `Then add a JSON block:
\`\`\`json
{"alternatives": [{"rank": 1, "name": "phone name", "reason": "one line in Hinglish"}]}
\`\`\`
Rank all phones from best to worst for this user.` : ''}

Write like a friend texting - casual, confident, Hinglish. Under 100 words.`
}
