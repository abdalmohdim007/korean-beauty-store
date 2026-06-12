import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Anon key is intentionally public — security is enforced by Supabase RLS policies
const SUPABASE_URL = 'https://zodajmbqwbgxhqrmcsst.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZGFqbWJxd2JneGhxcm1jc3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTgyMjYsImV4cCI6MjA5NjQzNDIyNn0.CPUCmozH8mUwRHr67feGCmO_CqqXUFmcIjfc932xM4c'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customer_name, phone, city, address, products, total } = body

    if (!customer_name || !phone || !city || !address || !products || total === undefined) {
      return NextResponse.json({ error: 'Missing required fields', received: Object.keys(body) }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({ customer_name, phone, city, address, products, total, status: 'pending' })
      .select()
      .single()

    if (error) {
      console.error('[create-order] Supabase error:', error)
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details, hint: error.hint },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, order: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[create-order] Caught error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
