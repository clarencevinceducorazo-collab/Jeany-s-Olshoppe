import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/get-user-role'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Archive, ArchiveRestore } from 'lucide-react'
import { archiveProduct } from '../actions'
import { ProductActionsMenu } from './product-actions-menu'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const role = await getUserRole()
  const isSuperAdmin = role === 'super_admin'

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products Catalog</h1>
          <p className="text-white/40 text-sm mt-1">Manage your store's inventory.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-white/60">
          <thead className="bg-white/5 text-xs uppercase text-white/40 font-mono">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products?.map((product) => (
              <tr key={product.id} className={`hover:bg-white/5 transition-colors ${product.is_archived ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-white/10 relative overflow-hidden shrink-0 border border-white/5">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt="" fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No img</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white/90 truncate max-w-[200px]">{product.name}</p>
                    <p className="text-xs text-white/40">{product.category}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">
                  ₱{Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  {product.stock_qty > 0 ? (
                    <span className="text-white/90">{product.stock_qty} in stock</span>
                  ) : (
                    <span className="text-red-400">Out of stock</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {product.badge && (
                      <span className="px-2 py-1 bg-accent/20 text-accent text-[10px] uppercase tracking-wider rounded font-bold border border-accent/40">
                        {product.badge}
                      </span>
                    )}
                    {product.is_featured && <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-[10px] uppercase tracking-wider rounded font-medium border border-yellow-400/20">Featured</span>}
                    {product.is_archived && <span className="px-2 py-1 bg-white/10 text-white/60 text-[10px] uppercase tracking-wider rounded font-medium border border-white/10">Archived</span>}
                    {!product.is_archived && !product.is_featured && !product.badge && <span className="px-2 py-1 bg-green-400/10 text-green-400 text-[10px] uppercase tracking-wider rounded font-medium border border-green-400/20">Active</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {/* Archive Button */}
                    <form action={archiveProduct.bind(null, product.id, !product.is_archived)}>
                      <button title={product.is_archived ? "Restore" : "Archive"} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                        {product.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                      </button>
                    </form>
                    
                    {/* Replaced fixed buttons with Dropdown Menu */}
                    <ProductActionsMenu productId={product.id} currentBadge={product.badge} />
                  </div>
                </td>
              </tr>
            ))}
            {!products?.length && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                  No products found. Start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
