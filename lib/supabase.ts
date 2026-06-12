import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name_ar: string
  name_en: string
  price: number
  category: string
  description_ar: string
  description_en: string
  images: string[]
  stock: number
  discount_percentage?: number
  is_featured?: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  phone: string
  city: string
  address: string
  products: OrderProduct[]
  total: number
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  created_at: string
}

export type OrderProduct = {
  id: string
  name_ar: string
  name_en: string
  price: number
  quantity: number
  image: string
}

export type CartItem = {
  product: Product
  quantity: number
}
