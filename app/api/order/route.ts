import { NextRequest } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PaymentTier } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tier, phone_ids } = body as { tier: PaymentTier; phone_ids: string[] }

    if (!tier || ![49, 99].includes(tier)) {
      return Response.json({ error: 'Invalid tier' }, { status: 400 })
    }
    if (!phone_ids || phone_ids.length < 2) {
      return Response.json({ error: 'At least 2 phones required' }, { status: 400 })
    }

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: tier * 100,
      currency: 'INR',
      receipt: `kp_${Date.now()}`,
      notes: { tier: String(tier), phone_count: String(phone_ids.length) },
    })

    // Save order to DB
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        phone_ids,
        tier,
        razorpay_order_id: razorpayOrder.id,
        status: 'pending',
      })
      .select()
      .single()

    if (error || !order) {
      return Response.json({ error: 'Failed to save order' }, { status: 500 })
    }

    return Response.json({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: tier * 100,
      currency: 'INR',
    })
  } catch (err) {
    console.error('Order creation error:', err)
    return Response.json({ error: 'Order creation failed' }, { status: 500 })
  }
}
