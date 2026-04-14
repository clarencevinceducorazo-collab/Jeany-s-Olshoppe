'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { archiveProduct } from '../actions'
import { ProductActionsMenu } from './product-actions-menu'
import { Archive, ArchiveRestore, Star, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  category: string
  condition: string
  stock_qty: number
  images: string[]
  is_featured: boolean
  is_archived: boolean
  badge: string | null
  created_at: string
}

interface ProductsClientProps {
  products: Product[]
}

// ── Mobile Card ───────────────────────────────────────────────────────────────
function ProductMobileCard({ product }: { product: Product }) {
  const [archivePending, startArchive] = useTransition()

  const statusColor = product.badge
    ? 'bg-accent/20 text-accent border-accent/30'
    : product.is_archived
    ? 'bg-white/10 text-white/40 border-white/10'
    : product.is_featured
    ? 'bg-yellow-400/15 text-yellow-400 border-yellow-400/25'
    : 'bg-green-500/10 text-green-400 border-green-500/20'

  const statusLabel = product.badge || (product.is_archived ? 'Archived' : product.is_featured ? 'Featured' : 'Active')

  return (
    <div className={`bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all ${product.is_archived ? 'opacity-60' : ''}`}>
      <div className="flex items-stretch gap-0">
        {/* Image */}
        <div className="w-20 shrink-0 bg-white/5 relative">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white/10" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="font-semibold text-white/90 text-sm leading-tight line-clamp-2">{product.name}</p>
            {/* Actions (the ⋯ menu) */}
            <ProductActionsMenu productId={product.id} currentBadge={product.badge} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-accent font-mono font-bold text-sm">
              ₱{Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
              {statusLabel}
            </span>
            {product.stock_qty === 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-red-500/10 text-red-400 border-red-500/20">
                Out of stock
              </span>
            )}
          </div>

          <p className="text-white/30 text-[11px] mt-1">{product.category} · {product.stock_qty} in stock</p>
        </div>
      </div>

      {/* Mobile action footer */}
      <div className="flex border-t border-white/5">
        <form
          action={() => { startArchive(async () => { await archiveProduct(product.id, !product.is_archived) }) }}
          className="flex-1"
        >
          <button
            type="submit"
            disabled={archivePending}
            className="w-full flex items-center justify-center gap-2 py-3 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
          >
            {product.is_archived
              ? <><ArchiveRestore className="w-3.5 h-3.5" /> Restore</>
              : <><Archive className="w-3.5 h-3.5" /> Archive</>
            }
          </button>
        </form>
        <div className="w-px bg-white/5" />
        <Link
          href={`/shop/${product.id}`}
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
        >
          <Star className="w-3.5 h-3.5" /> View
        </Link>
      </div>
    </div>
  )
}

// ── Desktop Table Row ─────────────────────────────────────────────────────────
function ProductTableRow({ product }: { product: Product }) {
  return (
    <tr className={`hover:bg-white/5 transition-colors ${product.is_archived ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white/10 relative overflow-hidden shrink-0 border border-white/5">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt="" fill className="object-cover" sizes="48px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-4 h-4 text-white/20" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-white/90 truncate max-w-[200px]">{product.name}</p>
            <p className="text-xs text-white/40">{product.category}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-white/70">
        ₱{Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        {product.stock_qty > 0
          ? <span className="text-white/70">{product.stock_qty} in stock</span>
          : <span className="text-red-400">Out of stock</span>}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
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
          <form action={archiveProduct.bind(null, product.id, !product.is_archived)}>
            <button title={product.is_archived ? 'Restore' : 'Archive'} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
              {product.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            </button>
          </form>
          <ProductActionsMenu productId={product.id} currentBadge={product.badge} />
        </div>
      </td>
    </tr>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function ProductsClient({ products }: ProductsClientProps) {
  return (
    <>
      {/* Mobile view */}
      <div className="lg:hidden space-y-3 px-4 pb-4">
        {products.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            No products yet. Start by adding one.
          </div>
        )}
        {products.map(product => (
          <ProductMobileCard key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block bg-white/5 border border-white/5 rounded-xl overflow-hidden">
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
            {products.map(product => (
              <ProductTableRow key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                  No products found. Start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
