'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore, useLangStore } from '@/lib/store'
import { Product } from '@/lib/supabase'
import { t } from '@/lib/translations'
import toast from 'react-hot-toast'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore()
  const { lang } = useLangStore()
  const tr = t[lang]

  const name = lang === 'ar' ? product.name_ar : product.name_en
  const image = product.images?.[0] || '/placeholder.jpg'
  const discount = product.discount_percentage && product.discount_percentage > 0 ? product.discount_percentage : null
  const discountedPrice = discount ? (product.price * (1 - discount / 100)).toFixed(3) : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock === 0) return
    addItem(product)
    toast.success(lang === 'ar' ? `تمت إضافة ${product.name_ar} للسلة` : `${product.name_en} added to cart`, {
      icon: '🛍️',
    })
  }

  return (
    <div className="card-hover bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-sm group">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold bg-gray-700 px-3 py-1 rounded-full text-sm">
              {tr.outOfStock}
            </span>
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-2 start-2 bg-[#FF85A1] text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            ⭐ الأكثر مبيعاً
          </div>
        )}
        {discount && (
          <div className={`absolute text-white text-xs font-bold px-2 py-1 rounded-full ${product.is_featured ? 'top-9 start-2' : 'top-2 start-2'} bg-red-500`}>
            خصم {discount}%
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-[#FF85A1]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <div className="bg-white rounded-full px-3 py-1.5 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform text-xs font-medium text-[#FF85A1]">
            عرض
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 hover:text-[#FF85A1] transition-colors leading-relaxed">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            {discount ? (
              <>
                <span className="text-gray-400 line-through text-sm leading-none">
                  {product.price} {tr.dinar}
                </span>
                <span className="text-red-500 font-bold text-lg leading-tight">
                  {discountedPrice} {tr.dinar}
                </span>
              </>
            ) : (
              <span className="text-[#FF85A1] font-bold text-lg">
                {product.price} {tr.dinar}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-[#FF85A1] hover:bg-[#E8607A] disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
