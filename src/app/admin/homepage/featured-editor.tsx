'use client'

import { useState, useTransition } from 'react'
import { useToast } from '@/hooks/use-toast'
import { saveFeaturedSection } from '../actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface FeaturedData {
  title?: string
  subtitle?: string
  visible?: boolean
  view_all_text?: string
  view_all_link?: string
}

export function FeaturedEditor({ initialData }: { initialData: FeaturedData }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [visible, setVisible] = useState<boolean>(initialData.visible !== false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('visible', String(visible))
    startTransition(async () => {
      const result = await saveFeaturedSection(formData)
      if (result.success) {
        toast({ title: 'Featured section saved!', description: 'Changes are live on the home page.' })
      } else {
        toast({ variant: 'destructive', title: 'Save failed', description: result.error })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="feat-title" className="text-white/80">Section Title</Label>
          <Input
            id="feat-title"
            name="title"
            defaultValue={initialData.title}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="e.g. Selected Arrivals"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="feat-subtitle" className="text-white/80">Subtitle</Label>
          <Input
            id="feat-subtitle"
            name="subtitle"
            defaultValue={initialData.subtitle}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="e.g. Pieces that bring calm..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="feat-view-all" className="text-white/80">View All Button Text</Label>
          <Input
            id="feat-view-all"
            name="view_all_text"
            defaultValue={initialData.view_all_text}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="e.g. View All Items"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="feat-view-link" className="text-white/80">View All Link</Label>
          <Input
            id="feat-view-link"
            name="view_all_link"
            defaultValue={initialData.view_all_link}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="/shop"
          />
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
        <div>
          <p className="text-white font-medium text-sm">Section Visibility</p>
          <p className="text-white/40 text-xs mt-0.5">Hide this section from the home page</p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${visible ? 'bg-accent' : 'bg-white/20'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${visible ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="bg-accent text-white hover:bg-accent/90 h-10 px-6">
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : 'Save Featured Section'}
        </Button>
      </div>
    </form>
  )
}
