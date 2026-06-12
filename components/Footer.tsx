'use client'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import InstagramIcon from '@/components/InstagramIcon'
import { useLangStore } from '@/lib/store'
import { t } from '@/lib/translations'

export default function Footer() {
  const { lang } = useLangStore()
  const tr = t[lang]

  return (
    <footer className="bg-[#FFF0F5] border-t border-pink-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌸</span>
              <span className="font-bold text-[#FF85A1] text-lg">{tr.storeName}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {lang === 'ar'
                ? 'أفضل منتجات العناية بالبشرة الكورية في الأردن'
                : 'Best Korean skincare products in Jordan'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-gray-500 hover:text-[#FF85A1] text-sm transition-colors">
                {tr.home}
              </Link>
              <Link href="/products" className="text-gray-500 hover:text-[#FF85A1] text-sm transition-colors">
                {tr.products}
              </Link>
              <Link href="/cart" className="text-gray-500 hover:text-[#FF85A1] text-sm transition-colors">
                {tr.cart}
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">
              {lang === 'ar' ? 'تابعينا' : 'Follow Us'}
            </h3>
            <a
              href="https://www.instagram.com/korean_beauty_products_jo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 hover:text-[#FF85A1] transition-colors group"
            >
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
                <InstagramIcon size={16} />
              </div>
              <span className="text-sm">@korean_beauty_products_jo</span>
            </a>
          </div>
        </div>

        <div className="border-t border-pink-200 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
            {lang === 'ar' ? 'صُنع بـ' : 'Made with'}
            <Heart size={14} className="text-[#FF85A1] fill-[#FF85A1]" />
            {lang === 'ar' ? '© 2024 منتجات الجمال الكورية' : '© 2024 Korean Beauty Products'}
          </p>
        </div>
      </div>
    </footer>
  )
}
