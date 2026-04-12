'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '../../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export function ProductForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [previewImages, setPreviewImages] = useState<{ url: string; name: string }[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPreviews = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }))

    setPreviewImages(newPreviews)
  }

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    // We cannot easily remove a single file from the generic FileList of standard input type="file"
    // So this is just a visual removal unless we do complex file state management.
    // However, to keep it simple, we will just inform the user we are resetting their selection for now if they click it,
    // OR practically, we can manage the files state entirely in React, but standard action requires a FormData.
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await createProduct(formData)
      
      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Product created successfully with images.',
        })
        router.push('/admin/products')
      } else {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: result.error || 'Something went wrong while saving the product.',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/5 p-8 rounded-xl">
      <div className="space-y-4">
        <Label htmlFor="images" className="text-white/80">Product Images (1 to 5 photos)</Label>
        
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                <Image src={img.url} alt={img.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/20 px-6 py-10 hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden group">
          <div className="text-center">
            <ImagePlus className="mx-auto h-12 w-12 text-white/20 group-hover:text-white/40 transition-colors" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-white/60 justify-center">
              <label htmlFor="images" className="relative cursor-pointer rounded-md font-semibold text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-[#120f0c] hover:text-accent/80">
                <span>Upload files</span>
                <input 
                  id="images" 
                  name="images" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="sr-only" 
                  required 
                  onChange={handleImageChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-white/40">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="name" className="text-white/80">Product Name</Label>
          <Input id="name" name="name" required className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12" placeholder="e.g. Vintage Floral Midi Dress" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-white/80">Price (₱)</Label>
          <Input id="price" name="price" type="number" step="0.01" required className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 font-mono" placeholder="0.00" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_qty" className="text-white/80">Stock Quantity</Label>
          <Input id="stock_qty" name="stock_qty" type="number" min="0" defaultValue="1" required className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 font-mono" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-white/80">Category</Label>
          <select id="category" name="category" className="w-full h-12 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent bg-[#1a1714]">
            <option value="Clothes">Clothes</option>
            <option value="Shoes">Shoes</option>
            <option value="Bags">Bags</option>
            <option value="Accessories">Accessories</option>
            <option value="Electronics">Electronics</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition" className="text-white/80">Condition</Label>
          <select id="condition" name="condition" className="w-full h-12 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent bg-[#1a1714]">
            <option value="Brand New">Brand New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white/80">Description</Label>
        <Textarea id="description" name="description" rows={5} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none" placeholder="Describe the item, its history, flaws, or unique features..." />
      </div>

      <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <input type="checkbox" id="is_featured" name="is_featured" className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent accent-accent" />
        <div className="space-y-1 leading-none">
          <Label htmlFor="is_featured" className="text-white font-medium">Feature Product</Label>
          <p className="text-xs text-white/40">This will pin the product to the home page carousel section.</p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8 min-w-[200px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Create Product'
          )}
        </Button>
      </div>
    </form>
  )
}
