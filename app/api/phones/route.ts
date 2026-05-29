import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get('q')
  const id = searchParams.get('id')

  // Single phone by ID
  if (id) {
    const { data, error } = await supabase
      .from('phones')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return Response.json({ error: 'Phone not found' }, { status: 404 })
    }
    return Response.json({ phone: data })
  }

  // Search by name
  if (q && q.length >= 2) {
    const { data, error } = await supabase
      .from('phones')
      .select('*')
      .ilike('name', `%${q}%`)
      .order('price_inr', { ascending: true })
      .limit(10)

    if (error) {
      return Response.json({ error: 'Search failed' }, { status: 500 })
    }
    return Response.json({ phones: data || [] })
  }

  // Popular phones (no filter)
  const { data, error } = await supabase
    .from('phones')
    .select('*')
    .order('price_inr', { ascending: true })
    .limit(12)

  if (error) {
    return Response.json({ error: 'Failed to fetch phones' }, { status: 500 })
  }
  return Response.json({ phones: data || [] })
}
