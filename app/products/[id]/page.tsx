'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import { SAMPLE_PRODUCTS } from '@/lib/sample-data'
import { useCartStore, useLangStore } from '@/lib/store'
import { t } from '@/lib/translations'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackButton from '@/components/BackButton'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { lang } = useLangStore()
  const { addItem } = useCartStore()
  const tr = t[lang]
  const isRTL = lang === 'ar'
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()
      setProduct(data || SAMPLE_PRODUCTS.find(p => p.id === params.id) || SAMPLE_PRODUCTS[0])
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <BackButton />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#FF85A1] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  if (!product) return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <BackButton />
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl">{tr.error}</p>
        <button onClick={() => router.back()} className="btn-primary mt-4">
          {isRTL ? 'رجوع' : 'Go Back'}
        </button>
      </div>
    </div>
  )

  const name = lang === 'ar' ? product.name_ar : product.name_en
  const description = lang === 'ar' ? product.description_ar : product.description_en
  const images = product.images?.length ? product.images : ['/placeholder.jpg']
  const discount = product.discount_percentage && product.discount_percentage > 0 ? product.discount_percentage : null
  const discountedPrice = discount ? (product.price * (1 - discount / 100)).toFixed(3) : null

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product)
    toast.success(lang === 'ar' ? `تمت إضافة ${product.name_ar} للسلة` : `${product.name_en} added to cart`, { icon: '🛍️' })
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="font-arabic">
      <Navbar />
      <BackButton />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <a href="/" className="hover:text-[#FF85A1]">{tr.home}</a>
          <span>/</span>
          <a href="/products" className="hover:text-[#FF85A1]">{tr.products}</a>
          <span>/</span>
          <span className="text-gray-600">{name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#FFF0F5] mb-4 shadow-lg">
              <Image
                src={images[imgIdx]}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                    className="absolute start-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgIdx ? 'border-[#FF85A1] scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FFF0F5] text-[#FF85A1] text-xs font-medium px-3 py-1 rounded-full">
                {tr.categories[product.category as keyof typeof tr.categories] || product.category}
              </span>
              {product.stock > 0 ? (
                <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                  ✓ {tr.inStock}
                </span>
              ) : (
                <span className="bg-red-50 text-red-500 text-xs font-medium px-3 py-1 rounded-full">
                  {tr.outOfStock}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-relaxed">{name}</h1>

            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-gray-400 text-sm ms-2">(12 {isRTL ? 'تقييم' : 'reviews'})</span>
            </div>

            <div className="mb-6 flex items-center gap-4">
              {discount ? (
                <>
                  <span className="text-4xl font-bold text-red-500">{discountedPrice} {tr.dinar}</span>
                  <span className="text-xl text-gray-400 line-through">{product.price} {tr.dinar}</span>
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">خصم {discount}%</span>
                </>
              ) : (
                <span className="text-4xl font-bold text-[#FF85A1]">{product.price} {tr.dinar}</span>
              )}
            </div>

            {description && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-700 mb-2">{tr.description}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600 font-medium">{tr.quantity}:</span>
              <div className="flex items-center border border-pink-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-pink-50 transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="px-4 py-2 font-bold text-lg min-w-[3rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={product.stock === 0}
                  className="px-4 py-2 hover:bg-pink-50 transition-colors font-bold text-lg disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex items-center justify-center gap-3 py-4 text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={20} />
              {product.stock === 0 ? tr.outOfStock : tr.addToCart}
            </button>

            <div className="mt-6 p-4 bg-[#FFF0F5] rounded-2xl">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span>🚚</span>
                <span>{isRTL ? 'توصيل لجميع محافظات الأردن' : 'Delivery to all Jordan governorates'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <span>💳</span>
                <span>{tr.cashOnDelivery}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
