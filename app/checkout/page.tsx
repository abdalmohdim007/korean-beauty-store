'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, ShoppingBag } from 'lucide-react'
import { useCartStore, useLangStore } from '@/lib/store'
import { t } from '@/lib/translations'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackButton from '@/components/BackButton'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const { lang } = useLangStore()
  const tr = t[lang]
  const isRTL = lang === 'ar'
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    city: '',
    address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [debugError, setDebugError] = useState<string | null>(null)

  const cities = tr.jordanianCities

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.customer_name.trim()) errs.customer_name = tr.required
    if (!form.phone.trim()) errs.phone = tr.required
    else if (!/^07\d{8}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = tr.phoneInvalid
    if (!form.city) errs.city = tr.required
    if (!form.address.trim()) errs.address = tr.required
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (items.length === 0) {
      toast.error(isRTL ? 'السلة فارغة' : 'Cart is empty')
      return
    }

    setLoading(true)
    setDebugError(null)
    try {
      const orderProducts = items.map((i) => ({
        id: i.product.id,
        name_ar: i.product.name_ar,
        name_en: i.product.name_en,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images?.[0] || '',
      }))

      // Save order via server-side API (avoids NEXT_PUBLIC build-time baking issue)
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          phone: form.phone,
          city: form.city,
          address: form.address,
          products: orderProducts,
          total: totalPrice(),
        }),
      })

      const json = await res.json()

      if (!res.ok || json.error) {
        const details = `Status: ${res.status}\nError: ${json.error}\nCode: ${json.code || '-'}\nDetails: ${json.details || '-'}\nHint: ${json.hint || '-'}`
        console.error('Order API error:', json)
        setDebugError(details)
        throw new Error(json.error || 'فشل حفظ الطلب')
      }
      console.log('Order created:', json.order)

      // Fire-and-forget: email notification
      fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          phone: form.phone,
          city: form.city,
          address: form.address,
          products: orderProducts,
          total: totalPrice(),
        }),
      }).catch(console.error)

      // Open WhatsApp with order summary
      const productLines = orderProducts
        .map((p) => `• ${p.name_ar} × ${p.quantity}`)
        .join('\n')
      const waMessage = encodeURIComponent(
        `🛍️ طلب جديد!\n\n👤 الاسم: ${form.customer_name}\n📞 الهاتف: ${form.phone}\n📍 ${form.city} - ${form.address}\n\n${productLines}\n\n💰 المجموع: ${totalPrice().toFixed(3)} دينار`
      )
      window.open(`https://wa.me/962787688671?text=${waMessage}`, '_blank')

      clearCart()
      setSuccess(true)
    } catch (err) {
      console.error('Checkout error:', err)
      const msg = err instanceof Error ? err.message : tr.error
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="font-arabic min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-[#FFF0F5] rounded-3xl p-12 max-w-md w-full shadow-lg animate-fadeIn">
          <CheckCircle size={72} className="text-[#FF85A1] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">{tr.orderSuccess}</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">{tr.orderSuccessDesc}</p>
          <Link href="/" className="btn-primary block py-3 text-base">{tr.backHome}</Link>
        </div>
      </div>
      <Footer />
    </div>
  )

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="font-arabic min-h-screen">
      <Navbar />
      <BackButton />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{tr.checkout}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{tr.customerName}</label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className={`input-field ${errors.customer_name ? 'border-red-400' : ''}`}
                placeholder={isRTL ? 'أدخلي اسمك الكامل' : 'Enter your full name'}
              />
              {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{tr.phone}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
                placeholder="07XXXXXXXX"
                dir="ltr"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{tr.city}</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={`input-field ${errors.city ? 'border-red-400' : ''}`}
              >
                <option value="">{isRTL ? 'اختاري المدينة' : 'Select city'}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{tr.address}</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={`input-field resize-none h-24 ${errors.address ? 'border-red-400' : ''}`}
                placeholder={isRTL ? 'الشارع، المنطقة، أقرب نقطة دالة' : 'Street, area, nearest landmark'}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Payment */}
            <div className="bg-[#FFF0F5] rounded-2xl p-4 border border-pink-200">
              <p className="text-sm font-medium text-gray-700 mb-2">{tr.paymentMethod}</p>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#FF85A1] ring-2 ring-[#FF85A1] ring-offset-2" />
                <span className="font-medium text-gray-700">💵 {tr.cashOnDelivery}</span>
              </div>
            </div>

            {debugError && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-xs font-mono text-red-700 whitespace-pre-wrap break-all">
                <p className="font-bold mb-2">⚠️ Supabase Error (debug):</p>
                {debugError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag size={20} />
              )}
              {tr.placeOrder}
            </button>
          </form>

          {/* Order summary */}
          <div>
            <div className="bg-[#FFF0F5] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">{tr.orderSummary}</h2>
              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => {
                  const name = lang === 'ar' ? item.product.name_ar : item.product.name_en
                  const image = item.product.images?.[0] || '/placeholder.jpg'
                  return (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                        <Image src={image} alt={name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 line-clamp-1">{name}</p>
                        <p className="text-xs text-gray-400">{tr.quantity}: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 flex-shrink-0">
                        {(item.product.price * item.quantity).toFixed(2)} {tr.dinar}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-pink-200 pt-4">
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>{tr.total}</span>
                  <span className="text-[#FF85A1]">{totalPrice().toFixed(2)} {tr.dinar}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-lg">📧</span>
                <p>{isRTL ? 'سيتم إرسال تفاصيل طلبك عبر البريد الإلكتروني للتأكيد' : 'Your order details will be sent via email for confirmation'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
