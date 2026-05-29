import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { anthropic, buildPriyaPrompt } from '@/lib/anthropic'
import { Phone, UserAnswers, AlternativePhone } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, answers, phone_ids, tier } = body as {
      order_id: string
      answers: UserAnswers
      phone_ids: string[]
      tier: 49 | 99
    }

    if (!order_id || !answers || !phone_ids?.length) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify payment before generating verdict
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, status, tier, phone_ids')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'paid') {
      return Response.json({ error: 'Payment not confirmed' }, { status: 402 })
    }

    // Fetch phone details
    const { data: phones, error: phonesError } = await supabaseAdmin
      .from('phones')
      .select('*')
      .in('id', phone_ids)

    if (phonesError || !phones || phones.length < 2) {
      return Response.json({ error: 'Phone data not found' }, { status: 404 })
    }

    const prompt = buildPriyaPrompt(phones as Phone[], answers, order.tier as 49 | 99)

    // Call Anthropic API with prompt caching for system prompt
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: 'You are Priya, a warm and knowledgeable Indian phone expert who gives recommendations like a trusted dost. Always respond in Hinglish — natural mix of Hindi and English. Be direct, warm, and never robotic.',
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract alternatives JSON if present (₹99 tier)
    let alternatives: AlternativePhone[] | null = null
    if (order.tier === 99) {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1])
          if (parsed.alternatives) {
            alternatives = parsed.alternatives.map(
              (alt: { rank: number; name: string; reason: string }, i: number) => ({
                rank: alt.rank || i + 1,
                phone_id: phones.find((p) =>
                  p.name.toLowerCase().includes(alt.name?.toLowerCase())
                )?.id || '',
                phone_name: alt.name,
                reason: alt.reason,
                flipkart_url:
                  phones.find((p) => p.name.toLowerCase().includes(alt.name?.toLowerCase()))
                    ?.flipkart_url || null,
                amazon_url:
                  phones.find((p) => p.name.toLowerCase().includes(alt.name?.toLowerCase()))
                    ?.amazon_url || null,
                price_inr:
                  phones.find((p) => p.name.toLowerCase().includes(alt.name?.toLowerCase()))
                    ?.price_inr || 0,
              })
            )
          }
        } catch {
          // Non-critical — proceed without alternatives
        }
      }
    }

    // Clean verdict text (remove JSON block)
    const cleanVerdict = responseText.replace(/```json[\s\S]*?```/g, '').trim()

    // Save verdict to DB
    const { data: verdict, error: verdictError } = await supabaseAdmin
      .from('verdicts')
      .insert({
        order_id,
        answers,
        verdict_text: cleanVerdict,
        alternatives,
      })
      .select('id')
      .single()

    if (verdictError || !verdict) {
      return Response.json({ error: 'Failed to save verdict' }, { status: 500 })
    }

    return Response.json({ verdict_id: verdict.id })
  } catch (err) {
    console.error('Verdict generation error:', err)
    return Response.json({ error: 'Failed to generate verdict' }, { status: 500 })
  }
}
