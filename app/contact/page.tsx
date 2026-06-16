'use client'
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react'
import { useLangStore } from '@/lib/store'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InstagramIcon from '@/components/InstagramIcon'
import FacebookIcon from '@/components/FacebookIcon'
import BackButton from '@/components/BackButton'

const PHONE = '+962787688671'
const PHONE_DISPLAY = '+962 78 768 8671'
const INSTAGRAM = 'korean_beauty_products_jo'

export default function ContactPage() {
  const { lang } = useLangStore()
  const isRTL = lang === 'ar'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="font-arabic min-h-screen flex flex-col">
      <Navbar />
      <BackButton />

      {/* Header */}
      <section className="pink-gradient py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-sm">
            {isRTL ? 'تواصلي معنا' : 'Contact Us'}
          </h1>
          <p className="text-white/90 text-lg">
            {isRTL
              ? 'نحن هنا للإجابة على جميع استفساراتك'
              : "We're here to answer all your questions"}
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="flex-1 max-w-3xl mx-auto w-full px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Call */}
          <a
            href={`tel:${PHONE}`}
            className="group flex flex-col items-center gap-4 bg-white rounded-3xl border border-pink-100 shadow-sm hover:shadow-lg hover:border-[#FF85A1] p-8 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#FFF0F5] group-hover:bg-[#FF85A1] flex items-center justify-center transition-colors">
              <Phone size={28} className="text-[#FF85A1] group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800 text-lg mb-1">
                {isRTL ? 'اتصلي بنا' : 'Call Us'}
              </p>
              <p className="text-[#FF85A1] font-medium text-base" dir="ltr">{PHONE_DISPLAY}</p>
              <p className="text-gray-400 text-sm mt-2">
                {isRTL ? 'انقري للاتصال مباشرة' : 'Tap to call directly'}
              </p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${PHONE.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 bg-white rounded-3xl border border-pink-100 shadow-sm hover:shadow-lg hover:border-green-400 p-8 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-green-50 group-hover:bg-green-500 flex items-center justify-center transition-colors">
              <MessageCircle size={28} className="text-green-500 group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800 text-lg mb-1">WhatsApp</p>
              <p className="text-green-500 font-medium text-base" dir="ltr">{PHONE_DISPLAY}</p>
              <p className="text-gray-400 text-sm mt-2">
                {isRTL ? 'راسلينا على واتساب' : 'Message us on WhatsApp'}
              </p>
            </div>
          </a>

          {/* Instagram */}
          <a
            href={`https://www.instagram.com/${INSTAGRAM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 bg-white rounded-3xl border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-400 p-8 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#FFF0F5] group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-yellow-400 flex items-center justify-center transition-all">
              <InstagramIcon size={28} className="text-[#FF85A1] group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800 text-lg mb-1">Instagram</p>
              <p className="text-[#FF85A1] font-medium text-base" dir="ltr">@{INSTAGRAM}</p>
              <p className="text-gray-400 text-sm mt-2">
                {isRTL ? 'تابعينا لأحدث المنتجات والعروض' : 'Follow us for the latest products and offers'}
              </p>
            </div>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/share/1EAVJWrjpY/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 bg-white rounded-3xl border border-pink-100 shadow-sm hover:shadow-lg hover:border-blue-400 p-8 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
              <FacebookIcon size={28} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800 text-lg mb-1">Facebook</p>
              <p className="text-blue-600 font-medium text-base">
                {isRTL ? 'صفحتنا الرسمية' : 'Our Official Page'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {isRTL ? 'تابعينا على فيسبوك للعروض الحصرية' : 'Follow us on Facebook for exclusive offers'}
              </p>
            </div>
          </a>
        </div>

        {/* Info strip */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-[#FFF0F5] rounded-2xl px-5 py-4">
            <MapPin size={20} className="text-[#FF85A1] shrink-0" />
            <div>
              <p className="font-semibold text-gray-700 text-sm">
                {isRTL ? 'منطقة التوصيل' : 'Delivery Area'}
              </p>
              <p className="text-gray-500 text-sm">
                {isRTL ? 'جميع محافظات المملكة الأردنية' : 'All Jordan governorates'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#FFF0F5] rounded-2xl px-5 py-4">
            <Clock size={20} className="text-[#FF85A1] shrink-0" />
            <div>
              <p className="font-semibold text-gray-700 text-sm">
                {isRTL ? 'ساعات الرد' : 'Response Hours'}
              </p>
              <p className="text-gray-500 text-sm">
                {isRTL ? 'يومياً من ٩ص حتى ١٠م' : 'Daily 9 AM – 10 PM'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
