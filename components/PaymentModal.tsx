'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, ShieldCheck } from 'lucide-react'
import { Phone, PaymentTier, UserAnswers } from '@/types'
import PriyaAvatar from './PriyaAvatar'

interface PaymentModalProps {
  tier: PaymentTier
  phone1: Phone
  phone2: Phone
  onClose: () => void
}

type Step = 'pay' | 'questions' | 'processing'

const USE_CASES: { value: UserAnswers['use_case']; label: string; emoji: string }[] = [
  { value: 'gaming', label: 'Gaming', emoji: '🎮' },
  { value: 'camera', label: 'Camera / Photos', emoji: '📸' },
  { value: 'daily', label: 'Roz ka kaam', emoji: '📱' },
  { value: 'everything', label: 'Sab kuch', emoji: '⚡' },
]

const HOURS: { value: UserAnswers['usage_hours']; label: string }[] = [
  { value: '2-4', label: '2–4 ghante' },
  { value: '4-7', label: '4–7 ghante' },
  { value: '7+', label: '7+ ghante' },
]

const LONGEVITY: { value: UserAnswers['longevity']; label: string }[] = [
  { value: '1-2', label: '1–2 saal' },
  { value: '2-3', label: '2–3 saal' },
  { value: '3+', label: '3+ saal' },
]

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export default function PaymentModal({ tier, phone1, phone2, onClose }: PaymentModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('pay')
  const [answers, setAnswers] = useState<Partial<UserAnswers>>({})
  const [paying, setPaying] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  async function handlePay() {
    setPaying(true)
    setError(null)
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          phone_ids: [phone1.id, phone2.id],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order create karne mein problem ayi')

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'KonsaPhone',
        description: tier === 49 ? "Priya ka Pick" : "Priya ka Full Analysis",
        order_id: data.razorpay_order_id,
        prefill: {},
        theme: { color: '#FF6B00' },
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          // Verify payment server-side
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: data.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          const verifyData = await verifyRes.json()
          if (!verifyRes.ok || !verifyData.verified) {
            setError('Payment verification fail ho gayi. Support se contact karo.')
            setPaying(false)
            return
          }
          setOrderId(data.order_id)
          setStep('questions')
          setPaying(false)
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kuch gadbad ho gayi')
      setPaying(false)
    }
  }

  async function handleSubmitAnswers() {
    if (!answers.use_case || !answers.usage_hours || !answers.longevity || !orderId) return
    setStep('processing')

    try {
      const res = await fetch('/api/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          answers,
          phone_ids: [phone1.id, phone2.id],
          tier,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Priya ka jawab laane mein problem')
      router.push(`/result/${data.verdict_id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kuch gadbad ho gayi')
      setStep('questions')
    }
  }

  const questionsComplete = answers.use_case && answers.usage_hours && answers.longevity

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-orange-500 p-4 flex items-center gap-3">
          <PriyaAvatar size="sm" />
          <div className="flex-1">
            <p className="text-white font-bold">
              {step === 'pay' && `Priya ka ${tier === 49 ? 'Pick' : 'Full Analysis'} — ₹${tier}`}
              {step === 'questions' && 'Bas 3 sawaal!'}
              {step === 'processing' && 'Priya soch rahi hai...'}
            </p>
            <p className="text-orange-100 text-xs">
              {step === 'pay' && 'UPI se 1 tap mein pay karo'}
              {step === 'questions' && 'Taaki main tumhare liye best phone find kar sakoon'}
              {step === 'processing' && 'Thoda wait karo, aa rahi hoon main...'}
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Step: Pay */}
          {step === 'pay' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {tier === 49 ? 'Priya ka Pick' : 'Priya ka Full Analysis'}
                  </span>
                  <span className="font-bold text-gray-900">₹{tier}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Phones</span>
                  <span>{phone1.name} vs {phone2.name}</span>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl p-3">{error}</p>
              )}

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70 hover:opacity-95 transition-opacity"
              >
                {paying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Pay ₹{tier} — UPI / Card
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                🔒 Secured by Razorpay · No subscription · One-time
              </p>
            </div>
          )}

          {/* Step: Questions */}
          {step === 'questions' && (
            <div className="space-y-5">
              {/* Q1 */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  📱 Phone mainly kisliye use karoge?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {USE_CASES.map((uc) => (
                    <button
                      key={uc.value}
                      onClick={() => setAnswers((a) => ({ ...a, use_case: uc.value }))}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        answers.use_case === uc.value
                          ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{uc.emoji}</span>
                      <br />
                      {uc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  ⏰ Din mein kitne ghante phone use karte ho?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {HOURS.map((h) => (
                    <button
                      key={h.value}
                      onClick={() => setAnswers((a) => ({ ...a, usage_hours: h.value }))}
                      className={`p-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                        answers.usage_hours === h.value
                          ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  📅 Kitne saal tak phone chalana chahte ho?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {LONGEVITY.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setAnswers((a) => ({ ...a, longevity: l.value }))}
                      className={`p-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                        answers.longevity === l.value
                          ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl p-3">{error}</p>
              )}

              <button
                onClick={handleSubmitAnswers}
                disabled={!questionsComplete}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white font-bold text-base disabled:opacity-40 hover:opacity-95 transition-opacity"
              >
                Priya ka jawab lao! →
              </button>
            </div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <PriyaAvatar size="lg" animated />
              <div className="space-y-1">
                <p className="font-bold text-gray-800">Priya analyze kar rahi hai...</p>
                <p className="text-sm text-gray-500">
                  Tere liye perfect phone dhundh rahi hoon, ek second!
                </p>
              </div>
              <Loader2 className="w-6 h-6 text-[#FF6B00] animate-spin mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
