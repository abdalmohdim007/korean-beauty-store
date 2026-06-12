import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import WhatsAppButton from '@/components/WhatsAppButton'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'منتجات الجمال الكورية | Korean Beauty Products',
  description: 'أفضل منتجات العناية بالبشرة الكورية في الأردن',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body className="font-arabic bg-white min-h-screen">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-tajawal), sans-serif',
              borderRadius: '12px',
            },
          }}
        />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
