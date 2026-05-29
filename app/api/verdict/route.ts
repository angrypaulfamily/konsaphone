import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getGroq, buildPriyaPrompt } from '@/lib/groq'
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

    const { data: phones, error: phonesError } = await supabaseAdmin
      .from('phones')
      .select('*')
      .in('id', phone_ids)

    if (phonesError || !phones || phones.length < 2) {
      return Response.json({ error: 'Phone data not found' }, { status: 404 })
    }

    const prompt = buildPriyaPrompt(phones as Phone[], answers, order.tier as 49 | 99)

    const groq = getGroq()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are Priya, a confident Indian friend who gives direct phone recommendations in Hinglish. Be decisive and brief.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: order.tier === 99 ? 1000 : 400,
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content || ''

    let alternatives: AlternativePhone[] | null = null
    if (order.tier === 99) {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1])
          if (parsed.alternatives) {
            alternatives = parsed.alternatives.map(
              (alt: { rank: number; name: string; reason: string }, i: number) => {
                const match = phones.find((p) =>
                  p.name.toLowerCase().includes(alt.name?.toLowerCase())
                )
                return {
                  rank: alt.rank || i + 1,
                  phone_id: match?.id || '',
                  phone_name: alt.name,
                  reason: alt.reason,
                  flipkart_url: match?.flipkart_url || null,
                  amazon_url: match?.amazon_url || null,
                  price_inr: match?.price_inr || 0,
                }
              }
            )
          }
        } catch {
          // Non-critical
        }
      }
    }

    const cleanVerdict = responseText.replace(/```json[\s\S]*?```/g, '').trim()

    const { data: verdict, error: verdictError } = await supabaseAdmin
      .from('verdicts')
      .insert({ order_id, answers, verdict_text: cleanVerdict, alternatives })
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
