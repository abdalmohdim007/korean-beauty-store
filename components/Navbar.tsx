'use client'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore, useLangStore } from '@/lib/store'
import { t } from '@/lib/translations'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useCartStore()
  const { lang, setLang } = useLangStore()

  // Only read persisted store after hydration to avoid mismatch
  useEffect(() => { setMounted(true) }, [])

  const tr = t[mounted ? lang : 'ar']
  const isRTL = !mounted || lang === 'ar'

  const navLinks = [
    { href: '/', label: tr.home },
    { href: '/products', label: tr.products },
    { href: '/about', label: tr.about },
    { href: '/contact', label: tr.contact },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="font-bold text-[#FF85A1] text-lg leading-tight">
            {isRTL ? 'منتجات الجمال الكورية' : 'Korean Beauty'}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-600 hover:text-[#FF85A1] font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF85A1] transition-colors px-2 py-1 rounded-lg border border-pink-100 hover:border-pink-300"
          >
            <Globe size={14} />
            {mounted ? (lang === 'ar' ? 'EN' : 'عر') : 'EN'}
          </button>

          {/* Cart — badge only rendered after mount to avoid hydration mismatch */}
          <Link href="/cart" className="relative p-2 hover:text-[#FF85A1] transition-colors">
            <ShoppingBag size={22} className="text-gray-700" />
            {mounted && totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF85A1] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems()}
              </span>
            )}
          </Link>

          {/* Mobile menu btn */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 px-4 py-3 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-700 hover:text-[#FF85A1] py-2 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
