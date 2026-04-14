'use client'

import { useState, useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Tag, Eraser, Loader2, Edit, Trash2 } from 'lucide-react'
import { updateProductBadge, deleteProduct } from '../actions'
import { useToast } from '@/hooks/use-toast'

interface ProductActionsMenuProps {
  productId: string
  currentBadge: string | null
}

export function ProductActionsMenu({ productId, currentBadge }: ProductActionsMenuProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  
  // Custom dialog state for "Other" badge
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const [customText, setCustomText] = useState('')

  const handleSetBadge = (badge: string | null) => {
    startTransition(async () => {
      const result = await updateProductBadge(productId, badge)
      if (result.success) {
        toast({ title: 'Status updated', description: badge ? \`Marked as "\${badge}"\` : 'Badge removed' })
      } else {
        toast({ variant: 'destructive', title: 'Failed to update', description: result.error })
      }
    })
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to completely delete this product?')) return
    startTransition(async () => {
      const result = await deleteProduct(productId)
      if (result.success) {
        toast({ title: 'Product deleted' })
      } else {
        toast({ variant: 'destructive', title: 'Delete failed', description: result.error })
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors outline-none focus:ring-2 focus:ring-accent/50 group">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin text-accent" /> : <MoreHorizontal className="w-4 h-4" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background border-white/10">
          <DropdownMenuLabel className="text-white/60 text-xs uppercase tracking-widest">Mark As</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          
          <DropdownMenuItem onClick={() => handleSetBadge('Sold')} className="hover:bg-white/5 cursor-pointer text-white">
            <Tag className="w-4 h-4 mr-2 opacity-50" /> Sold
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSetBadge('New Arrival')} className="hover:bg-white/5 cursor-pointer text-white">
            <Tag className="w-4 h-4 mr-2 text-blue-400 opacity-50" /> New Arrival
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSetBadge('Sale')} className="hover:bg-white/5 cursor-pointer text-white">
            <Tag className="w-4 h-4 mr-2 text-accent opacity-50" /> Sale
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowCustomPrompt(true)} className="hover:bg-white/5 cursor-pointer text-white">
            <Tag className="w-4 h-4 mr-2 text-yellow-400 opacity-50" /> Other...
          </DropdownMenuItem>
          
          {currentBadge && (
            <>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={() => handleSetBadge(null)} className="hover:bg-white/5 font-medium cursor-pointer text-white/70">
                <Eraser className="w-4 h-4 mr-2 text-foreground/50" /> Remove Badge
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="bg-white/10" />

          {/* Edit (stub) and Delete */}
          <DropdownMenuItem className="opacity-50 cursor-not-allowed">
            <Edit className="w-4 h-4 mr-2" /> Edit Product
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="hover:bg-red-500/20 text-red-400 cursor-pointer focus:text-red-400 focus:bg-red-500/20">
            <Trash2 className="w-4 h-4 mr-2 text-red-400" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Simple Custom Badge Prompt Overlay */}
      {showCustomPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm border border-border p-5 rounded-2xl shadow-xl shadow-black/50">
            <h3 className="text-lg font-semibold text-foreground mb-1 tracking-tight">Custom Badge</h3>
            <p className="text-sm text-muted-foreground mb-4">Enter a short text for the product badge.</p>
            <input 
              type="text" 
              autoFocus
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground text-sm outline-none focus:ring-1 focus:ring-accent mb-5"
              placeholder="e.g. Reserved, Reduced, 10% Off"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = customText.trim()
                  if (val) handleSetBadge(val)
                  setShowCustomPrompt(false)
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCustomPrompt(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  const val = customText.trim()
                  if (val) handleSetBadge(val)
                  setShowCustomPrompt(false)
                }} 
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
                disabled={!customText.trim() || isPending}
              >
                Apply Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
