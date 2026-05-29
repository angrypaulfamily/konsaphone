import Anthropic from '@anthropic-ai/sdk'
import { Phone, UserAnswers } from '@/types'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export function buildPriyaPrompt(
  phones: Phone[],
  answers: UserAnswers,
  tier: 49 | 99
): string {
  const phoneList = phones
    .map(
      (p, i) =>
        `Phone ${i + 1}: ${p.name}
  - Price: ₹${p.price_inr.toLocaleString('en-IN')}
  - Processor: ${p.processor}
  - RAM: ${p.ram_gb}GB
  - Storage: ${p.storage_gb}GB
  - Battery: ${p.battery_mah}mAh, ${p.charging_w}W charging
  - Camera: ${p.camera_mp}MP main, ${p.front_camera_mp}MP front
  - Display: ${p.display_size_inch}" ${p.display_type} ${p.display_hz}Hz
  - 5G: ${p.has_5g ? 'Yes' : 'No'}
  - Best for: ${p.best_for || 'General use'}
  - Camera verdict: ${p.plain_camera_verdict || 'N/A'}
  - Battery verdict: ${p.plain_battery_verdict || 'N/A'}
  - Gaming verdict: ${p.plain_gaming_verdict || 'N/A'}`
    )
    .join('\n\n')

  const useCaseMap = {
    gaming: 'Gaming (BGMI, Free Fire, heavy games)',
    camera: 'Photography and videos',
    daily: 'Roz ka kaam (calls, WhatsApp, YouTube, social media)',
    everything: 'Sab kuch — gaming, camera, aur daily use',
  }

  const hoursMap = {
    '2-4': '2-4 ghante',
    '4-7': '4-7 ghante',
    '7+': '7+ ghante (heavy user)',
  }

  const longevityMap = {
    '1-2': '1-2 saal',
    '2-3': '2-3 saal',
    '3+': '3+ saal',
  }

  const is99Tier = tier === 99

  return `You are Priya — a warm, confident, knowledgeable Indian woman who gives phone recommendations like a smart dost would. You speak in Hinglish (mix of Hindi and English, natural and casual). You are NOT a robot. You give clear, direct advice with warmth and personality. You genuinely care about getting the user the right phone for their needs.

User ka profile:
- Phone mainly use karenge: ${useCaseMap[answers.use_case]}
- Daily usage: ${hoursMap[answers.usage_hours]} phone chalate hain
- Longevity chahiye: ${longevityMap[answers.longevity]}

Phones being compared:
${phoneList}

${is99Tier ? `Yeh ₹99 wala Full Analysis hai — toh tu sabse pehle ek clear winner choose kar, phir ek ranked list de baaki phones ki alternatives ke saath (agar compare kiye gaye phones mein se 1 clearly better hai). Flipkart/Amazon deals bhi mention kar agar available hain.` : `Yeh ₹49 wala Priya ka Pick hai — seedha bol kaunsa lena chahiye aur kyun. Short aur crisp rakh.`}

Respond in this format:
1. Start with a warm, personal Hinglish opener (1-2 lines) — jaise tu apne dost ko baat kar rahi ho
2. Give your CLEAR recommendation — kaunsa phone lena chahiye
3. Explain WHY in 2-3 points — user ke specific use case ke hisaab se
4. Mention 1 thing to watch out for (honest advice)
5. End with an encouraging, warm closing line

${is99Tier ? '6. Also provide a JSON block at the end in this exact format for alternatives:\n```json\n{"alternatives": [{"rank": 1, "name": "phone name", "reason": "brief reason in Hinglish"}]}\n```\nInclude all compared phones ranked by suitability for this user.' : ''}

Keep it conversational, warm, and under 250 words. No bullet points that feel robotic — write it like you are actually talking to the person. Use Hinglish naturally throughout.`
}
