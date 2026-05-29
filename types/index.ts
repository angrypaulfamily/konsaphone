export interface Phone {
  id: string
  name: string
  brand: string
  price_inr: number
  battery_mah: number
  camera_mp: number
  front_camera_mp: number
  processor: string
  ram_gb: number
  storage_gb: number
  display_size_inch: number
  display_hz: number
  display_type: string
  has_5g: boolean
  charging_w: number
  best_for: string | null
  plain_camera_verdict: string | null
  plain_battery_verdict: string | null
  plain_gaming_verdict: string | null
  flipkart_url: string | null
  amazon_url: string | null
  launch_date: string | null
}

export interface SpecComparison {
  label: string
  key: keyof Phone
  phone1Value: string | number | boolean
  phone2Value: string | number | boolean
  phone1Plain?: string
  phone2Plain?: string
  winner: 1 | 2 | 0
  unit?: string
}

export type PaymentTier = 49 | 99

export interface Order {
  id: string
  phone_ids: string[]
  tier: PaymentTier
  razorpay_order_id: string
  razorpay_payment_id: string | null
  status: 'pending' | 'paid' | 'failed'
  created_at: string
}

export interface Verdict {
  id: string
  order_id: string
  answers: UserAnswers
  verdict_text: string
  alternatives: AlternativePhone[] | null
  created_at: string
}

export interface UserAnswers {
  use_case: 'gaming' | 'camera' | 'daily' | 'everything'
  usage_hours: '2-4' | '4-7' | '7+'
  longevity: '1-2' | '2-3' | '3+'
}

export interface AlternativePhone {
  rank: number
  phone_id: string
  phone_name: string
  reason: string
  flipkart_url: string | null
  amazon_url: string | null
  price_inr: number
}

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
}
