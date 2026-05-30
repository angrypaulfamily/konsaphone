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
  - OS: ${p.os || 'Android'}, updates until ${p.sw_until_year ?? 'unknown'}
  - IP Rating: ${p.ip_rating || 'None'}, Weight: ${p.weight_g ? p.weight_g + 'g' : 'unknown'}
  - Reddit overall: ${p.reddit_sentiment || 'unknown'}
  - What users love: ${p.reddit_praise || 'N/A'}
  - What users complain about: ${p.reddit_complaints || 'N/A'}`
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

  return `You are Priya - a confident Indian friend who gives direct phone recommendations in Hinglish. You have done your research AND you know what real users think from Reddit and tech communities. When relevant, cite what users actually say - use phrases like "log kehte hain", "users ne bola", "reddit pe bahut praise milti hai isko". Be decisive and personal, not corporate.

User wants the phone for: ${useCaseMap[answers.use_case]}
Daily usage: ${hoursMap[answers.usage_hours]}
Wants to keep it for: ${longevityMap[answers.longevity]}

Phones being compared:
${phoneList}

Give a SHORT, DIRECT verdict in 3-4 sentences max. No intro, no fluff. Just:
1. Which phone to buy (be decisive)
2. Main reason - specific to their use case, weave in what real users say
3. One honest watch-out (if users complain about something relevant, mention it)

${tier === 99 ? `Then add a JSON block:
\`\`\`json
{"alternatives": [{"rank": 1, "name": "phone name", "reason": "one line in Hinglish"}]}
\`\`\`
Rank all phones from best to worst for this user.` : ''}

Write like a friend texting - casual, confident, Hinglish. Under 120 words.`
}
