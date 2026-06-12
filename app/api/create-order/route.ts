import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return NextResponse.json(
      { error: 'Supabase URL is not configured. Add SUPABASE_URL to Vercel env vars.' },
      { status: 500 }
    )
  }
  if (!supabaseKey || supabaseKey.includes('placeholder')) {
    return NextResponse.json(
      { error: 'Supabase key is not configured. Add SUPABASE_ANON_KEY to Vercel env vars.' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const body = await req.json()
    const { customer_name, phone, city, address, products, total } = body

    if (!customer_name || !phone || !city || !address || !products || total === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({ customer_name, phone, city, address, products, total, status: 'pending' })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details, hint: error.hint },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, order: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Create order error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
