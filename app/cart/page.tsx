'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCartStore, useLangStore } from '@/lib/store'
import { t } from '@/lib/translations'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const { lang } = useLangStore()
  const tr = t[lang]
  const isRTL = lang === 'ar'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="font-arabic min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-[#FF85A1]" size={32} />
          {tr.cart}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-7xl mb-6 block">🛍️</span>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">{tr.cartEmpty}</h2>
            <p className="text-gray-400 mb-8">{tr.cartEmptyDesc}</p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 py-3 px-8">
              {tr.continueShopping}
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => {
                const name = lang === 'ar' ? item.product.name_ar : item.product.name_en
                const image = item.product.images?.[0] || '/placeholder.jpg'
                return (
                  <div
                    key={item.product.id}
                    className="bg-white border border-pink-100 rounded-2xl p-4 flex gap-4 shadow-sm animate-fadeIn"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#FFF0F5]">
                      <Image src={image} alt={name} fill className="object-cover" sizes="96px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-sm leading-relaxed mb-1">{name}</h3>
                      <p className="text-[#FF85A1] font-bold text-lg">{item.product.price} {tr.dinar}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-pink-200 rounded-full overflow-hidden text-sm">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-pink-50 transition-colors"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 font-bold min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-pink-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors ms-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-end">
                      <p className="font-bold text-gray-700">
                        {(item.product.price * item.quantity).toFixed(2)} {tr.dinar}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#FFF0F5] rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">{tr.orderSummary}</h2>
                <div className="flex justify-between text-gray-600 mb-3">
                  <span>{tr.subtotal}</span>
                  <span>{totalPrice().toFixed(2)} {tr.dinar}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-3">
                  <span>{isRTL ? 'التوصيل' : 'Delivery'}</span>
                  <span className="text-green-600 font-medium">{isRTL ? 'مجاني' : 'Free'}</span>
                </div>
                <div className="border-t border-pink-200 my-4" />
                <div className="flex justify-between font-bold text-gray-800 text-lg mb-6">
                  <span>{tr.total}</span>
                  <span className="text-[#FF85A1]">{totalPrice().toFixed(2)} {tr.dinar}</span>
                </div>
                <Link href="/checkout" className="btn-primary block text-center py-3.5 text-base">
                  {tr.proceedCheckout}
                </Link>
                <Link href="/products" className="block text-center text-[#FF85A1] hover:text-[#E8607A] mt-3 text-sm transition-colors">
                  {tr.continueShopping}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
