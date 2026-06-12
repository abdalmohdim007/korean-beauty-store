'use client'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      aria-label="رجوع"
      className="fixed top-[72px] start-4 z-40 bg-white text-[#FF85A1] border border-pink-200 shadow-md rounded-full p-2.5 hover:bg-[#FFF0F5] hover:scale-105 active:scale-95 transition-all"
    >
      <ChevronRight size={20} />
    </button>
  )
}
