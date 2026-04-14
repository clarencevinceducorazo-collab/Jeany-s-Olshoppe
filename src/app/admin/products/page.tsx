import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ProductsClient } from './products-client'

export default async function AdminProductsPage() {
  if (!(await isAdmin())) redirect('/')

  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Products Catalog</h1>
          <p className="text-white/40 text-xs md:text-sm mt-0.5">
            {products?.length ?? 0} items · Tap ⋯ to manage
          </p>
        </div>
        {/* Desktop add button */}
        <Link
          href="/admin/products/new"
          className="hidden md:flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Dual-layout content */}
      <ProductsClient products={(products as any) ?? []} />

      {/* Mobile FAB */}
      <Link
        href="/admin/products/new"
        className="md:hidden fixed bottom-20 right-4 z-30 flex items-center justify-center w-14 h-14 bg-accent rounded-full shadow-2xl shadow-accent/40 hover:bg-accent/90 active:scale-95 transition-all"
        aria-label="Add Product"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  )
}
