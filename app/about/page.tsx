'use client'
import Link from 'next/link'
import { Truck, Star, ShieldCheck, Users, ArrowLeft, ArrowRight } from 'lucide-react'
import { useLangStore } from '@/lib/store'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackButton from '@/components/BackButton'

const STATS = [
  { icon: Users, valueAr: '+١٠,٠٠٠', valueEn: '10,000+', labelAr: 'عميلة سعيدة', labelEn: 'Happy Customers' },
  { icon: Star, valueAr: '٢٠١٩', valueEn: '2019', labelAr: 'بداية رحلتنا', labelEn: 'Since 2019' },
  { icon: ShieldCheck, valueAr: '١٠٠٪', valueEn: '100%', labelAr: 'منتجات أصلية', labelEn: 'Authentic Products' },
  { icon: Truck, valueAr: 'سريع', valueEn: 'Fast', labelAr: 'توصيل لكل الأردن', labelEn: 'Delivery Across Jordan' },
]

const FEATURES_AR = [
  { icon: ShieldCheck, title: 'منتجات أصلية ١٠٠٪', body: 'نضمن لكِ أن جميع منتجاتنا أصلية ومستوردة مباشرة من كوريا الجنوبية. لا مكان للتقليد في متجرنا.' },
  { icon: Star, title: 'شغف بالجمال الكوري منذ ٢٠١٩', body: 'بدأنا رحلتنا في عالم الجمال الكوري منذ عام ٢٠١٩، نختار بعناية كل منتج ليناسب البشرة العربية ويمنحها الإشراقة التي تستحقها.' },
  { icon: Users, title: 'ثقة أكثر من ١٠,٠٠٠ عميلة', body: 'بنينا مجتمعاً من العميلات الراضيات اللواتي يثقن بجودة منتجاتنا ويعدن للتسوق مراراً وتكراراً.' },
  { icon: Truck, title: 'توصيل سريع لجميع المحافظات', body: 'نوصل طلباتك لجميع محافظات المملكة الأردنية بسرعة وأمان مع الحفاظ على جودة المنتجات.' },
]

const FEATURES_EN = [
  { icon: ShieldCheck, title: '100% Authentic Products', body: 'We guarantee all our products are authentic and imported directly from South Korea. No counterfeits, ever.' },
  { icon: Star, title: 'Passionate About K-Beauty Since 2019', body: 'We started our Korean beauty journey in 2019, carefully selecting every product to suit Middle Eastern skin and bring out its natural glow.' },
  { icon: Users, title: 'Trusted by 10,000+ Customers', body: "We've built a community of satisfied customers who trust our quality and come back time and again." },
  { icon: Truck, title: 'Fast Delivery Across Jordan', body: 'We deliver to all Jordan governorates quickly and safely, keeping your products in perfect condition.' },
]

export default function AboutPage() {
  const { lang } = useLangStore()
  const isRTL = lang === 'ar'
  const features = isRTL ? FEATURES_AR : FEATURES_EN

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="font-arabic min-h-screen flex flex-col">
      <Navbar />
      <BackButton />

      {/* Hero */}
      <section className="pink-gradient py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {['🌸', '✨', '💗', '🌺', '💫'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl animate-float"
              style={{ left: `${8 + i * 18}%`, top: `${20 + (i % 2) * 40}%`, animationDelay: `${i * 0.6}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <span className="text-6xl mb-6 block">🌸</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-sm">
            {isRTL ? 'من نحن' : 'About Us'}
          </h1>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-3">
            {isRTL
              ? 'بدأنا رحلتنا في عالم الجمال الكوري منذ عام ٢٠١٩'
              : 'We started our Korean beauty journey since 2019'}
          </p>
          <p className="text-white font-bold text-lg md:text-xl drop-shadow-sm">
            منتجات الجمال الكورية - جمال لا تشوبه شائبة
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#FFF0F5] flex items-center justify-center mb-1">
                  <Icon size={22} className="text-[#FF85A1]" />
                </div>
                <span className="text-3xl font-bold text-[#FF85A1]">{isRTL ? s.valueAr : s.valueEn}</span>
                <span className="text-gray-500 text-sm font-medium">{isRTL ? s.labelAr : s.labelEn}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isRTL ? 'قصتنا' : 'Our Story'}
        </h2>
        {isRTL ? (
          <div className="bg-[#FFF0F5] rounded-3xl p-8 text-gray-700 leading-loose text-base space-y-4">
            <p>
              بدأنا رحلتنا في عالم الجمال الكوري منذ عام ٢٠١٩، من شغف حقيقي وإيمان راسخ بأن كل سيدة تستحق الحصول على منتجات عناية أصيلة وفعّالة بأسعار مناسبة.
            </p>
            <p>
              انطلقنا بهدف واحد: جلب أفضل ما أنتجته كوريا الجنوبية من منتجات تجميلية مباشرةً إلى يدي المرأة الأردنية. ومنذ ذلك الحين، نمت ثقة عميلاتنا شيئاً فشيئاً حتى وصلنا اليوم إلى أكثر من ١٠,٠٠٠ عميلة سعيدة يشاركننا هذا الشغف.
            </p>
            <p>
              كل منتج في متجرنا يمر بعملية اختيار دقيقة للتأكد من أصالته وجودته وملاءمته للبشرة العربية. نستورد مباشرة من كوريا الجنوبية لنضمن لكِ الحصول على المنتج الأصلي بلا وسيط.
            </p>
            <p>
              نوصل لجميع محافظات المملكة الأردنية بسرعة وأمان، لأنكِ تستحقين تجربة تسوق مريحة من البيت.
            </p>
          </div>
        ) : (
          <div className="bg-[#FFF0F5] rounded-3xl p-8 text-gray-700 leading-loose text-base space-y-4">
            <p>
              We started our Korean beauty journey in 2019, driven by a genuine passion and a firm belief that every woman deserves access to authentic, effective skincare at fair prices.
            </p>
            <p>
              From day one, our goal was simple: bring the best of South Korea&apos;s beauty innovations directly to women across Jordan. Since then, our community has grown steadily to over 10,000 happy customers who share our love for K-beauty.
            </p>
            <p>
              Every product in our store goes through a careful selection process to verify its authenticity, quality, and suitability for Middle Eastern skin. We import directly from South Korea — no middlemen, no compromises.
            </p>
            <p>
              We deliver to all Jordan governorates quickly and safely, because you deserve a comfortable shopping experience from home.
            </p>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {isRTL ? 'لماذا تختارين متجرنا؟' : 'Why Choose Us?'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="flex gap-4 bg-white rounded-2xl border border-pink-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-full bg-[#FFF0F5] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={20} className="text-[#FF85A1]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#FF85A1] to-[#E8607A] py-14 text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-3">
            {isRTL ? 'ابدئي تجربتك معنا اليوم' : 'Start Your Journey With Us Today'}
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            {isRTL ? 'آلاف المنتجات الكورية الأصيلة بانتظارك' : 'Thousands of authentic Korean products await you'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-[#FF85A1] font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              {isRTL ? 'تسوقي الآن' : 'Shop Now'}
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              {isRTL ? 'تواصلي معنا' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
