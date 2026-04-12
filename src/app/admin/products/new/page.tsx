import { ProductForm } from './product-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create New Product</h1>
          <p className="text-white/40 text-sm mt-1">Add a new item to your catalog.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  )
}
