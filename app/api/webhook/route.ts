import { NextRequest } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature') || ''

    if (!verifyWebhookSignature(rawBody, signature)) {
      return Response.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      if (!payment) return Response.json({ ok: true })

      const razorpayOrderId = payment.order_id
      const razorpayPaymentId = payment.id

      // Find matching order
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('razorpay_order_id', razorpayOrderId)
        .single()

      if (order && order.status !== 'paid') {
        await supabaseAdmin
          .from('orders')
          .update({ razorpay_payment_id: razorpayPaymentId, status: 'paid' })
          .eq('id', order.id)
      }
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    // Always return 200 to Razorpay to prevent retries on our errors
    return Response.json({ ok: true })
  }
}

