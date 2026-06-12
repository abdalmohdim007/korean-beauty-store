import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Log env var state so it shows in Vercel Function Logs
  console.log('[create-order] ENV CHECK:', {
    SUPABASE_URL: process.env.SUPABASE_URL ? `set (${process.env.SUPABASE_URL.slice(0, 30)}...)` : 'MISSING',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? `set (${process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 30)}...)` : 'MISSING',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? `set (${process.env.SUPABASE_ANON_KEY.slice(0, 20)}...)` : 'MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `set (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 20)}...)` : 'MISSING',
    resolvedUrl: supabaseUrl ? `${supabaseUrl.slice(0, 30)}...` : 'NONE',
    resolvedKey: supabaseKey ? `${supabaseKey.slice(0, 20)}...` : 'NONE',
  })

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return NextResponse.json(
      { error: 'Supabase URL is not configured. Add SUPABASE_URL to Vercel env vars.', debug: { SUPABASE_URL: !!process.env.SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL } },
      { status: 500 }
    )
  }
  if (!supabaseKey || supabaseKey.includes('placeholder')) {
    return NextResponse.json(
      { error: 'Supabase key is not configured. Add SUPABASE_ANON_KEY to Vercel env vars.', debug: { SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY } },
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
