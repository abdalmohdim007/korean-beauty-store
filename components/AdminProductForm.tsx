'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, Upload, X, Loader } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const CATEGORIES = ['skincare', 'makeup', 'haircare', 'bodycare', 'sunscreen', 'masks']
const CATEGORY_LABELS: Record<string, string> = {
  skincare: 'العناية بالبشرة', makeup: 'المكياج', haircare: 'العناية بالشعر',
  bodycare: 'العناية بالجسم', sunscreen: 'واقي الشمس', masks: 'الأقنعة',
}

type FormData = {
  name_ar: string
  name_en: string
  price: string
  category: string
  description_ar: string
  description_en: string
  stock: string
  discount_percentage: string
  is_featured: boolean
  images: string[]
}

export default function AdminProductForm({ productId }: { productId?: string }) {
  const router = useRouter()
  const isEdit = !!productId
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<FormData>({
    name_ar: '', name_en: '', price: '', category: 'skincare',
    description_ar: '', description_en: '', stock: '0', discount_percentage: '', is_featured: false, images: [],
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') !== 'true') {
      router.push('/admin')
    }
  }, [router])

  useEffect(() => {
    if (isEdit && productId) {
      supabase.from('products').select('*').eq('id', productId).single().then(({ data }) => {
        if (data) {
          setForm({
            name_ar: data.name_ar, name_en: data.name_en,
            price: String(data.price), category: data.category,
            description_ar: data.description_ar || '',
            description_en: data.description_en || '',
            stock: String(data.stock),
            discount_percentage: data.discount_percentage ? String(data.discount_percentage) : '',
            is_featured: !!data.is_featured,
            images: data.images || [],
          })
        }
      })
    }
  }, [isEdit, productId])

  const handleImageUpload = async (files: FileList) => {
    setUploading(true)
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }
    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }))
    setUploading(false)
    if (uploaded.length > 0) toast.success(`تم رفع ${uploaded.length} صورة`)
  }

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name_ar || !form.name_en || !form.price || !form.category) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة')
      return
    }
    setLoading(true)
    const payload = {
      name_ar: form.name_ar,
      name_en: form.name_en,
      price: parseFloat(form.price),
      category: form.category,
      description_ar: form.description_ar,
      description_en: form.description_en,
      stock: parseInt(form.stock) || 0,
      discount_percentage: form.discount_percentage ? parseInt(form.discount_percentage) : null,
      is_featured: form.is_featured,
      images: form.images,
    }
    let error
    if (isEdit) {
      ({ error } = await supabase.from('products').update(payload).eq('id', productId))
    } else {
      ({ error } = await supabase.from('products').insert(payload))
    }
    setLoading(false)
    if (error) {
      toast.error('حدث خطأ: ' + error.message)
    } else {
      toast.success(isEdit ? 'تم تحديث المنتج' : 'تم إضافة المنتج')
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-arabic" dir="rtl">
      <header className="bg-white border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.push('/admin')} className="text-gray-500 hover:text-[#FF85A1] transition-colors">
            <ArrowRight size={20} />
          </button>
          <h1 className="font-bold text-gray-800">{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name AR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم بالعربية *</label>
            <input
              value={form.name_ar}
              onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
              className="input-field"
              placeholder="اسم المنتج بالعربية"
              required
            />
          </div>

          {/* Name EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم بالإنجليزية *</label>
            <input
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              className="input-field"
              placeholder="Product name in English"
              dir="ltr"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              السعر *
              <span className="text-gray-400 font-normal me-1"> (دينار)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => {
                  const v = e.target.value
                  if (v === '' || /^\d*\.?\d*$/.test(v)) setForm({ ...form, price: v })
                }}
                className="input-field ps-10"
                placeholder="مثال: 12.500"
                dir="ltr"
                required
              />
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">JD</span>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              المخزون
              <span className="text-gray-400 font-normal me-1"> (عدد القطع)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => {
                  const v = e.target.value
                  if (v === '' || /^\d+$/.test(v)) setForm({ ...form, stock: v })
                }}
                className="input-field ps-10"
                placeholder="مثال: 50"
                dir="ltr"
              />
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📦</span>
            </div>
          </div>

          {/* Discount */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              نسبة الخصم
              <span className="text-gray-400 font-normal me-1"> (اتركه فارغاً إن لم يكن هناك خصم)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={form.discount_percentage}
                onChange={(e) => {
                  const v = e.target.value
                  if (v === '' || (/^\d+$/.test(v) && parseInt(v) <= 100)) setForm({ ...form, discount_percentage: v })
                }}
                className="input-field ps-10"
                placeholder="مثال: 20"
                dir="ltr"
              />
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">%</span>
            </div>
          </div>

          {/* Best Seller toggle */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                form.is_featured
                  ? 'border-[#FF85A1] bg-[#FFF0F5]'
                  : 'border-gray-200 bg-white hover:border-pink-200'
              }`}
            >
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <span className="text-lg">⭐</span>
                الأكثر مبيعاً (منتج مميز)
              </span>
              <div className={`w-11 h-6 rounded-full transition-colors relative ${form.is_featured ? 'bg-[#FF85A1]' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_featured ? 'start-5' : 'start-0.5'}`} />
              </div>
            </button>
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الفئة *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-field"
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>

          {/* Desc AR */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف بالعربية</label>
            <textarea
              value={form.description_ar}
              onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
              className="input-field resize-none h-24"
              placeholder="وصف المنتج بالعربية"
            />
          </div>

          {/* Desc EN */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف بالإنجليزية</label>
            <textarea
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              className="input-field resize-none h-24"
              placeholder="Product description in English"
              dir="ltr"
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الصور</label>
            <div className="border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center hover:border-[#FF85A1] transition-colors relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-[#FF85A1]">
                  <Loader size={32} className="animate-spin" />
                  <p>جاري الرفع...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={32} />
                  <p className="font-medium">اسحبي الصور أو انقري للاختيار</p>
                  <p className="text-sm">PNG, JPG, WEBP</p>
                </div>
              )}
            </div>

            {form.images.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-pink-100 group">
                    <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#FF85A1]/80 text-white text-xs text-center py-0.5">
                        رئيسية
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : null}
              {isEdit ? 'حفظ التغييرات' : 'إضافة المنتج'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="btn-secondary px-8 py-3.5"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
