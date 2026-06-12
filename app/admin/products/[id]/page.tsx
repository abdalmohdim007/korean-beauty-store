'use client'
export const dynamic = 'force-dynamic'
import { useParams } from 'next/navigation'
import AdminProductForm from '@/components/AdminProductForm'

export default function EditProductPage() {
  const params = useParams()
  return <AdminProductForm productId={params.id as string} />
}
