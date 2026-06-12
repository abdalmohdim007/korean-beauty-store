'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import InstagramIcon from '@/components/InstagramIcon'
import { useEffect, useState } from 'react'
import { supabase, Product } from '@/lib/supabase'
import { SAMPLE_PRODUCTS } from '@/lib/sample-data'
import { useLangStore } from '@/lib/store'
import { t } from '@/lib/translations'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = ['skincare', 'makeup', 'haircare', 'bodycare', 'sunscreen', 'masks']

export default function HomePage() {
  const { lang } = useLangStore()
  const tr = t[lang]
  const isRTL = lang === 'ar'
  const [featured, setFeatured] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)
      setFeatured(data && data.length > 0 ? data : SAMPLE_PRODUCTS)

      const { data: featuredData } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
      setBestSellers(featuredData && featuredData.length > 0 ? featuredData : [])

      setLoading(false)
    }
    load()
  }, [])

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="font-arabic">
      <Navbar />

      {/* Hero */}
      <section className="pink-gradient min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {['🌸', '✨', '💗', '🌺', '💫', '🌷'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-start">
            <Link href="/products" className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-[#E8607A] font-medium text-sm hover:bg-white/70 transition-colors">
              <Sparkles size={14} />
              {isRTL ? 'جديد في المتجر' : 'New Arrivals'}
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-sm">
              {tr.heroTitle}
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
              {tr.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/products" className="btn-primary text-base py-3 px-8 flex items-center gap-2">
                {tr.shopNow}
                {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </Link>
              <a
                href="https://www.instagram.com/korean_beauty_products_jo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-medium py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg text-base"
              >
                <InstagramIcon size={18} className="text-pink-500" />
                {tr.followInstagram}
              </a>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <span className="text-[160px] md:text-[200px] animate-float" style={{ filter: 'drop-shadow(0 10px 30px rgba(255,133,161,0.5))' }}>
                  🌸
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {isRTL ? 'تسوقي حسب الفئة' : 'Shop by Category'}
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const icons: Record<string, string> = {
              skincare: '🧴', makeup: '💄', haircare: '💇',
              bodycare: '🛁', sunscreen: '☀️', masks: '🎭',
            }
            return (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className="flex flex-col items-center gap-2 p-4 bg-[#FFF0F5] hover:bg-[#FF85A1] hover:text-white rounded-2xl transition-all group card-hover"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{icons[cat]}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-white text-center">
                  {tr.categories[cat as keyof typeof tr.categories]}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Best Sellers */}
      {!loading && bestSellers.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <h2 className="text-2xl font-bold text-gray-800">
                {isRTL ? 'الأكثر مبيعاً' : 'Best Sellers'}
              </h2>
            </div>
            <Link href="/products" className="text-[#FF85A1] hover:text-[#E8607A] font-medium text-sm flex items-center gap-1 transition-colors">
              {isRTL ? 'عرض الكل' : 'View All'}
              {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{tr.featuredProducts}</h2>
          <Link href="/products" className="text-[#FF85A1] hover:text-[#E8607A] font-medium text-sm flex items-center gap-1 transition-colors">
            {isRTL ? 'عرض الكل' : 'View All'}
            {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-pink-50 rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl mb-4 block">🛍️</span>
            <p>{tr.noProducts}</p>
          </div>
        )}
      </section>

      {/* Instagram CTA */}
      <section className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 py-16 text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <InstagramIcon size={48} className="mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">
            {isRTL ? 'تابعينا على إنستغرام' : 'Follow Us on Instagram'}
          </h2>
          <p className="text-white/90 mb-6 text-lg">@korean_beauty_products_jo</p>
          <a
            href="https://www.instagram.com/korean_beauty_products_jo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-pink-600 font-bold py-3 px-10 rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            {isRTL ? 'زيارة الصفحة' : 'Visit Page'}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
