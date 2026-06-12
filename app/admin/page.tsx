'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Lock, Package, ShoppingBag, LogOut, Plus, CheckCircle2, XCircle } from 'lucide-react'
import { supabase, Product, Order } from '@/lib/supabase'
import { SAMPLE_PRODUCTS } from '@/lib/sample-data'
import Link from 'next/link'

function OrderCard({
  order, statusColors, statusLabels, onStatusChange, isActive,
}: {
  order: Order
  statusColors: Record<string, string>
  statusLabels: Record<string, string>
  onStatusChange: (id: string, status: string) => void
  isActive: boolean
}) {
  const borderColor = order.status === 'delivered'
    ? 'border-green-200 bg-green-50/30'
    : order.status === 'cancelled'
    ? 'border-red-200 bg-red-50/20'
    : 'border-gray-100 bg-white'

  return (
    <div className={`rounded-2xl p-5 shadow-sm border ${borderColor}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {order.status === 'delivered' && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
            {order.status === 'cancelled' && <XCircle size={16} className="text-red-500 shrink-0" />}
            <h3 className="font-bold text-gray-800">{order.customer_name}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span>📞 {order.phone}</span>
            <span>📍 {order.city} - {order.address}</span>
            <span>📅 {new Date(order.created_at).toLocaleDateString('ar-JO')}</span>
          </div>
        </div>
        <div className="text-end">
          <p className="text-xl font-bold text-[#FF85A1]">{order.total} دينار</p>
        </div>
      </div>

      <div className="bg-white/70 rounded-xl p-3 mb-4">
        {order.products.map((p, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-600 py-1">
            <span>{p.name_ar} × {p.quantity}</span>
            <span>{(p.price * p.quantity).toFixed(2)} دينار</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {isActive ? (
          <>
            <span className="text-sm text-gray-500">تغيير الحالة:</span>
            {['pending', 'processing', 'delivered', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(order.id, s)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  order.status === s
                    ? `${statusColors[s]} font-bold`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </>
        ) : (
          <>
            <span className="text-sm text-gray-400">إعادة تفعيل:</span>
            {['pending', 'processing'].map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(order.id, s)}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
              >
                {statusLabels[s]}
              </button>
            ))}
          </>
        )}
        <a
          href={`https://wa.me/${order.phone.replace(/^0/, '962')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="me-auto text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full transition-colors"
        >
          📱 واتساب
        </a>
      </div>
    </div>
  )
}

const ADMIN_PASSWORD = 'admin123'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<'products' | 'orders'>('orders')
  const [loading, setLoading] = useState(false)
  const knownOrderCount = useRef<number | null>(null)
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthed(sessionStorage.getItem('admin_auth') === 'true')
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (authed) {
      loadData()
    }
  }, [authed, tab])

  const playBell = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      const frequencies = [880, 1108, 1320]
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18)
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18)
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.18 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.6)
        osc.start(ctx.currentTime + i * 0.18)
        osc.stop(ctx.currentTime + i * 0.18 + 0.7)
      })
    } catch {}
  }, [])

  const showBrowserNotification = useCallback((count: number) => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      new Notification('🛍️ طلب جديد!', {
        body: `وصل ${count} طلب جديد — تحققي من لوحة التحكم`,
        icon: '/favicon.ico',
      })
    } else if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const checkNewOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('id')
      .in('status', ['pending', 'processing'])
    const currentCount = data?.length ?? 0
    if (knownOrderCount.current === null) {
      knownOrderCount.current = currentCount
      return
    }
    const newOrders = currentCount - knownOrderCount.current
    if (newOrders > 0) {
      knownOrderCount.current = currentCount
      playBell()
      showBrowserNotification(newOrders)
      // Reload orders list so new orders appear immediately
      const { data: all } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(all || [])
    }
  }, [playBell, showBrowserNotification])

  useEffect(() => {
    if (!authed) return
    // Request notification permission on login
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    pollInterval.current = setInterval(checkNewOrders, 30000)
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current)
    }
  }, [authed, checkNewOrders])

  async function loadData() {
    setLoading(true)
    if (tab === 'products') {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data && data.length > 0 ? data : SAMPLE_PRODUCTS)
    } else {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data || [])
    }
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthed(true)
      setError('')
    } else {
      setError('كلمة المرور غير صحيحة')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setAuthed(false)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    await supabase.from('products').delete().eq('id', id)
    loadData()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_featured: !current }).eq('id', id)
    loadData()
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    loadData()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  }

  const statusLabels: Record<string, string> = {
    pending: 'قيد الانتظار',
    processing: 'جاري التجهيز',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
  }

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing')
  const previousOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled')

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] flex items-center justify-center p-4 font-arabic" dir="rtl">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
          <div className="text-center mb-8">
            <div className="bg-[#FFF0F5] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#FF85A1]" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
            <p className="text-gray-400 text-sm mt-1">منتجات الجمال الكورية</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="input-field text-center text-lg tracking-widest"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="btn-primary py-3 text-base">دخول</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-arabic" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <div>
              <h1 className="font-bold text-gray-800">لوحة التحكم</h1>
              <p className="text-xs text-gray-400">منتجات الجمال الكورية</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-[#FF85A1] transition-colors">
              عرض المتجر
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              tab === 'orders' ? 'bg-[#FF85A1] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-pink-50'
            }`}
          >
            <ShoppingBag size={16} />
            الطلبات
            {activeOrders.length > 0 && tab === 'orders' && (
              <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">{activeOrders.length}</span>
            )}
          </button>
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              tab === 'products' ? 'bg-[#FF85A1] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-pink-50'
            }`}
          >
            <Package size={16} />
            المنتجات
          </button>
          {tab === 'products' && (
            <Link
              href="/admin/products/new"
              className="me-auto flex items-center gap-2 btn-primary py-2 px-5 text-sm"
            >
              <Plus size={16} />
              إضافة منتج
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#FF85A1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'orders' ? (
          // Orders
          <div className="flex flex-col gap-8">

            {/* Active Orders */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-gray-800 text-lg">الطلبات النشطة</h2>
                {activeOrders.length > 0 && (
                  <span className="bg-[#FF85A1] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {activeOrders.length}
                  </span>
                )}
              </div>
              {activeOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
                  <ShoppingBag size={36} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">لا توجد طلبات نشطة</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      statusColors={statusColors}
                      statusLabels={statusLabels}
                      onStatusChange={updateOrderStatus}
                      isActive
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Previous Orders */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-gray-700 text-lg">الطلبات السابقة</h2>
                {previousOrders.length > 0 && (
                  <span className="bg-gray-300 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {previousOrders.length}
                  </span>
                )}
              </div>
              {previousOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-300 bg-white rounded-2xl border border-gray-100">
                  <p className="text-sm">لا توجد طلبات سابقة</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {previousOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      statusColors={statusColors}
                      statusLabels={statusLabels}
                      onStatusChange={updateOrderStatus}
                      isActive={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Products
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400">
                <Package size={48} className="mx-auto mb-3 opacity-30" />
                <p>لا توجد منتجات بعد</p>
              </div>
            ) : (
              products.map((p) => (
                <div key={p.id} className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-colors ${p.is_featured ? 'border-[#FF85A1]' : 'border-gray-100'}`}>
                  <div className="relative aspect-video bg-[#FFF0F5]">
                    {p.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name_ar} className="w-full h-full object-cover" />
                    )}
                    {p.is_featured && (
                      <span className="absolute top-2 start-2 bg-[#FF85A1] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        ⭐ الأكثر مبيعاً
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{p.name_ar}</h3>
                    <p className="text-[#FF85A1] font-bold">{p.price} دينار</p>
                    <p className="text-xs text-gray-400 mt-1">
                      المخزون: {p.stock} | {p.category}
                    </p>
                    <button
                      onClick={() => toggleFeatured(p.id, !!p.is_featured)}
                      className={`w-full mt-2 text-xs py-1.5 rounded-lg transition-colors ${
                        p.is_featured
                          ? 'bg-[#FFF0F5] text-[#FF85A1] font-semibold'
                          : 'bg-gray-50 text-gray-400 hover:bg-[#FFF0F5] hover:text-[#FF85A1]'
                      }`}
                    >
                      {p.is_featured ? '⭐ مميز — انقر للإلغاء' : '☆ تعيين كالأكثر مبيعاً'}
                    </button>
                    <div className="flex gap-2 mt-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="flex-1 text-center text-xs bg-[#FFF0F5] hover:bg-pink-100 text-[#FF85A1] py-2 rounded-lg transition-colors"
                      >
                        تعديل
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="flex-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-lg transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
