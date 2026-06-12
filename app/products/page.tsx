'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import { SAMPLE_PRODUCTS } from '@/lib/sample-data'
import { useLangStore } from '@/lib/store'
import { t } from '@/lib/translations'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Suspense } from 'react'

const CATEGORIES = ['skincare', 'makeup', 'haircare', 'bodycare', 'sunscreen', 'masks']

function ProductsContent() {
  const searchParams = useSearchParams()
  const { lang } = useLangStore()
  const tr = t[lang]
  const isRTL = lang === 'ar'
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    setCategory(searchParams.get('category') || '')
  }, [searchParams])

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase.from('products').select('*').order('created_at', { ascending: false })
      if (category) query = query.eq('category', category)
      const { data } = await query
      if (data && data.length > 0) {
        setProducts(data)
      } else {
        const fallback = category
          ? SAMPLE_PRODUCTS.filter(p => p.category === category)
          : SAMPLE_PRODUCTS
        setProducts(fallback)
      }
      setLoading(false)
    }
    load()
  }, [category])

  const filtered = products.filter((p) => {
    if (!search) return true
    return (
      p.name_ar.toLowerCase().includes(search.toLowerCase()) ||
      p.name_en.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="font-arabic">
      <Navbar />

      {/* Header */}
      <div className="bg-[#FFF0F5] py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{tr.products}</h1>
        <p className="text-gray-500">
          {isRTL ? 'اكتشفي مجموعتنا من منتجات الجمال الكورية' : 'Discover our Korean beauty collection'}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr.search}
              className="input-field !ps-10"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === ''
                  ? 'bg-[#FF85A1] text-white shadow-md'
                  : 'bg-[#FFF0F5] text-gray-600 hover:bg-pink-100'
              }`}
            >
              {tr.allCategories}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-[#FF85A1] text-white shadow-md'
                    : 'bg-[#FFF0F5] text-gray-600 hover:bg-pink-100'
                }`}
              >
                {tr.categories[cat as keyof typeof tr.categories]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-pink-50 rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-gray-400 text-sm mb-4">
              {isRTL ? `${filtered.length} منتج` : `${filtered.length} products`}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-lg">{tr.noProducts}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  )
}
