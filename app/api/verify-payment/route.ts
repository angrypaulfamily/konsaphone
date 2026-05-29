import { NextRequest } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body

    if (!order_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return Response.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // Verify signature server-side — cryptographically secure
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValid) {
      // Mark order as failed
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', order_id)
      return Response.json({ verified: false, error: 'Invalid signature' }, { status: 400 })
    }

    // Update order as paid
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        razorpay_payment_id,
        status: 'paid',
      })
      .eq('id', order_id)
      .eq('razorpay_order_id', razorpay_order_id) // double-check order ID matches

    if (error) {
      return Response.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return Response.json({ verified: true })
  } catch (err) {
    console.error('Payment verification error:', err)
    return Response.json({ error: 'Verification failed' }, { status: 500 })
  }
}
