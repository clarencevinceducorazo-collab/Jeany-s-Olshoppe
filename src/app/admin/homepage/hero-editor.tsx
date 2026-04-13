'use client'

import { useState, useTransition } from 'react'
import { useToast } from '@/hooks/use-toast'
import { saveHeroSection } from '../actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, ImagePlus, Type, Link as LinkIcon, Quote } from 'lucide-react'
import Image from 'next/image'

interface HeroData {
  title?: string
  subtitle?: string
  description?: string
  button_text?: string
  button_link?: string
  image_url?: string
  quote?: string
}

export function HeroEditor({ initialData }: { initialData: HeroData }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState<string>(initialData.image_url || '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await saveHeroSection(formData)
      if (result.success) {
        toast({ title: 'Hero section saved!', description: 'Changes are live on the home page.' })
      } else {
        toast({ variant: 'destructive', title: 'Save failed', description: result.error })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden current image url */}
      <input type="hidden" name="image_url" value={imagePreview} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="hero-title" className="text-white/80 flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-accent" /> Main Title
          </Label>
          <Input
            id="hero-title"
            name="title"
            defaultValue={initialData.title}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="e.g. Wabi-Sabi Aesthetics."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-subtitle" className="text-white/80 flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-accent" /> Subtitle / Badge
          </Label>
          <Input
            id="hero-subtitle"
            name="subtitle"
            defaultValue={initialData.subtitle}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="e.g. Premium Japan Surplus – Philippines"
          />
        </div>

        <div className="space-y-2 col-span-full">
          <Label htmlFor="hero-description" className="text-white/80">Description</Label>
          <Textarea
            id="hero-description"
            name="description"
            defaultValue={initialData.description}
            rows={3}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
            placeholder="Short description shown below the title..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-btn-text" className="text-white/80 flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5 text-accent" /> Button Text
          </Label>
          <Input
            id="hero-btn-text"
            name="button_text"
            defaultValue={initialData.button_text}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="e.g. Explore Collection"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-btn-link" className="text-white/80 flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5 text-accent" /> Button Link
          </Label>
          <Input
            id="hero-btn-link"
            name="button_link"
            defaultValue={initialData.button_link}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="/shop"
          />
        </div>

        <div className="space-y-2 col-span-full">
          <Label htmlFor="hero-quote" className="text-white/80 flex items-center gap-2">
            <Quote className="w-3.5 h-3.5 text-accent" /> Decorative Quote
          </Label>
          <Input
            id="hero-quote"
            name="quote"
            defaultValue={initialData.quote}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="e.g. Simplicity is the ultimate sophistication."
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <Label className="text-white/80 flex items-center gap-2">
          <ImagePlus className="w-3.5 h-3.5 text-accent" /> Hero Background Image
        </Label>
        {imagePreview && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10">
            <Image src={imagePreview} alt="Hero preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setImagePreview('')}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-red-500/80 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex justify-center rounded-lg border border-dashed border-white/20 px-6 py-8 hover:bg-white/5 transition-colors cursor-pointer relative">
          <div className="text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-white/20 mb-3" />
            <label htmlFor="hero-image-file" className="cursor-pointer text-sm text-accent hover:text-accent/80 font-medium">
              Upload new image
              <input
                id="hero-image-file"
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

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-accent text-white hover:bg-accent/90 h-10 px-6"
        >
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : 'Save Hero Section'}
        </Button>
      </div>
    </form>
  )
}
