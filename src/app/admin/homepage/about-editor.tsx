'use client'

import { useState, useTransition } from 'react'
import { useToast } from '@/hooks/use-toast'
import { saveAboutSection } from './actions'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, ImagePlus } from 'lucide-react'
import Image from 'next/image'

interface AboutData {
  text?: string
  image_url?: string
}

export function AboutEditor({ initialData }: { initialData: AboutData }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState<string>(initialData.image_url || '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await saveAboutSection(formData)
      if (result.success) {
        toast({ title: 'About section saved!', description: 'Changes are live on the home page.' })
      } else {
        toast({ variant: 'destructive', title: 'Save failed', description: result.error })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="image_url" value={imagePreview} />

      <div className="space-y-2">
        <Label htmlFor="about-text" className="text-white/80">Branding / About Text</Label>
        <Textarea
          id="about-text"
          name="text"
          defaultValue={initialData.text}
          rows={5}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
          placeholder="Describe your brand, philosophy, and what makes you unique..."
        />
        <p className="text-white/30 text-xs">This text appears in the about/branding section of the home page.</p>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <Label className="text-white/80 flex items-center gap-2">
          <ImagePlus className="w-3.5 h-3.5 text-accent" /> About Image (optional)
        </Label>
        {imagePreview && (
          <div className="relative w-full max-w-sm h-40 rounded-lg overflow-hidden border border-white/10">
            <Image src={imagePreview} alt="About preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setImagePreview('')}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-red-500/80 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex justify-center rounded-lg border border-dashed border-white/20 px-6 py-8 hover:bg-white/5 transition-colors cursor-pointer">
          <div className="text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-white/20 mb-3" />
            <label htmlFor="about-image-file" className="cursor-pointer text-sm text-accent hover:text-accent/80 font-medium">
              Upload image
              <input
                id="about-image-file"
                name="image_file"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setImagePreview(URL.createObjectURL(file))
                }}
              />
            </label>
            <p className="text-xs text-white/40 mt-1">PNG, JPG, WEBP – leave empty to keep current</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-accent text-white hover:bg-accent/90 h-10 px-6"
        >
          {isPending
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
            : 'Save About Section'}
        </Button>
      </div>
    </form>
  )
}
