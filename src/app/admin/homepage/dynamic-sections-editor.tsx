'use client'

import { useState, useTransition } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createHomeSection, updateHomeSection, deleteHomeSection, reorderHomeSection } from './actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Loader2, Plus, Trash2, ChevronUp, ChevronDown,
  Eye, EyeOff, ImagePlus, LayoutPanelLeft, Edit, X, Check
} from 'lucide-react'
import Image from 'next/image'

interface HomeSection {
  id: string
  title: string
  description: string | null
  image_url: string | null
  layout: string
  sort_order: number
  visible: boolean
}

const LAYOUT_OPTIONS = [
  { value: 'text-only', label: 'Text Only', icon: '¶' },
  { value: 'banner', label: 'Banner', icon: '▬' },
  { value: 'grid', label: 'Grid', icon: '▦' },
]

function SectionCard({ section, onReorder, onDelete, onUpdate }: {
  section: HomeSection
  onReorder: (dir: 'up' | 'down') => void
  onDelete: () => void
  onUpdate: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleting] = useTransition()
  const [imagePreview, setImagePreview] = useState(section.image_url || '')
  const [visible, setVisible] = useState(section.visible)
  const { toast } = useToast()

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('visible', String(visible))
    if (imagePreview && !formData.get('image_file')) {
      formData.set('image_url', imagePreview)
    }
    startTransition(async () => {
      const result = await updateHomeSection(section.id, formData)
      if (result.success) {
        toast({ title: 'Section updated!' })
        setEditing(false)
        onUpdate()
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error })
      }
    })
  }

  const handleDelete = () => {
    if (!confirm('Delete this section? This cannot be undone.')) return
    startDeleting(async () => {
      const result = await deleteHomeSection(section.id)
      if (result.success) {
        toast({ title: 'Section deleted.' })
        onDelete()
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error })
      }
    })
  }

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${visible ? 'border-white/10 bg-white/5' : 'border-white/5 bg-white/[0.02] opacity-60'}`}>
      {/* Card Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onReorder('up')}
            className="text-white/30 hover:text-white transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onReorder('down')}
            className="text-white/30 hover:text-white transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{section.title}</p>
          <p className="text-white/30 text-xs capitalize">{section.layout} · Order #{section.sort_order}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
            section.layout === 'banner' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
            section.layout === 'grid' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
            'text-white/40 border-white/10 bg-white/5'
          }`}>
            {section.layout}
          </span>
          {visible
            ? <Eye className="w-3.5 h-3.5 text-green-400" />
            : <EyeOff className="w-3.5 h-3.5 text-white/30" />
          }
          <button
            type="button"
            onClick={() => setEditing(e => !e)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-accent transition-colors"
          >
            {editing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <form onSubmit={handleUpdate} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs">Title *</Label>
              <Input
                name="title"
                defaultValue={section.title}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs">Sort Order</Label>
              <Input
                name="sort_order"
                type="number"
                defaultValue={section.sort_order}
                className="bg-white/5 border-white/10 text-white h-10 text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5 col-span-full">
              <Label className="text-white/70 text-xs">Description</Label>
              <Textarea
                name="description"
                defaultValue={section.description || ''}
                rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs">Layout</Label>
              <select
                name="layout"
                defaultValue={section.layout}
                className="w-full h-10 rounded-md border border-white/10 bg-[#1a1714] px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {LAYOUT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs">Visibility</Label>
              <button
                type="button"
                onClick={() => setVisible(v => !v)}
                className={`flex items-center gap-2 h-10 px-3 w-full rounded-md border text-sm transition-colors ${
                  visible ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/10 bg-white/5 text-white/40'
                }`}
              >
                {visible ? <><Eye className="w-3.5 h-3.5" />Visible</> : <><EyeOff className="w-3.5 h-3.5" />Hidden</>}
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label className="text-white/70 text-xs flex items-center gap-1.5">
              <ImagePlus className="w-3 h-3" /> Image
            </Label>
            {imagePreview && (
              <div className="relative w-full h-32 rounded overflow-hidden border border-white/10">
                <Image src={imagePreview} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded hover:bg-red-500/80"
                >Remove</button>
              </div>
            )}
            <input type="hidden" name="image_url" value={imagePreview} />
            <label className="block cursor-pointer text-xs text-accent hover:text-accent/80">
              Upload image
              <input
                type="file"
                name="image_file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setImagePreview(URL.createObjectURL(file))
                }}
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(false)} className="h-9 text-white/40 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-accent text-white hover:bg-accent/90 h-9 px-5 text-sm">
              {isPending ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving…</> : <><Check className="w-3.5 h-3.5 mr-1.5" />Save</>}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export function DynamicSectionsEditor({ initialSections }: { initialSections: HomeSection[] }) {
  const { toast } = useToast()
  const [sections, setSections] = useState<HomeSection[]>(initialSections)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState('')
  const [layout, setLayout] = useState('text-only')

  // Refresh from server
  const refresh = async () => {
    // We force a re-render. In a real app you'd refetch. For now, rely on router.refresh() or page revalidation.
    window.location.reload()
  }

  const handleReorder = (id: string, dir: 'up' | 'down') => {
    startTransition(async () => {
      await reorderHomeSection(id, dir)
      refresh()
    })
  }

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('layout', layout)
    startTransition(async () => {
      const result = await createHomeSection(formData)
      if (result.success) {
        toast({ title: 'New section created!', description: 'It is now live on the home page.' })
        setShowAddForm(false)
        setImagePreview('')
        refresh()
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Section List */}
      {sections.length === 0 && (
        <p className="text-white/30 text-sm text-center py-8 border border-dashed border-white/10 rounded-xl">
          No dynamic sections yet. Add one below.
        </p>
      )}

      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          onReorder={(dir) => handleReorder(section.id, dir)}
          onDelete={refresh}
          onUpdate={refresh}
        />
      ))}

      {/* Add Section Form */}
      {showAddForm ? (
        <form onSubmit={handleCreate} className="space-y-4 border border-accent/20 bg-accent/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white font-semibold text-sm flex items-center gap-2">
              <LayoutPanelLeft className="w-4 h-4 text-accent" />
              New Dynamic Section
            </p>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-white/30 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-full">
              <Label className="text-white/70 text-xs">Title *</Label>
              <Input
                name="title"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
                placeholder="e.g. New Arrivals Banner"
              />
            </div>

            <div className="space-y-1.5 col-span-full">
              <Label className="text-white/70 text-xs">Description</Label>
              <Textarea
                name="description"
                rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
                placeholder="Describe this section..."
              />
            </div>

            <div className="space-y-1.5 col-span-full">
              <Label className="text-white/70 text-xs">Layout Type</Label>
              <div className="flex gap-2">
                {LAYOUT_OPTIONS.map(o => (
                  <button
                    type="button"
                    key={o.value}
                    onClick={() => setLayout(o.value)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      layout === o.value
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="block text-lg mb-0.5">{o.icon}</span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white/70 text-xs flex items-center gap-1.5">
              <ImagePlus className="w-3 h-3" /> Image (optional)
            </Label>
            {imagePreview && (
              <div className="relative w-full h-32 rounded overflow-hidden border border-white/10">
                <Image src={imagePreview} alt="" fill className="object-cover" />
                <button type="button" onClick={() => setImagePreview('')} className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded hover:bg-red-500/80">Remove</button>
              </div>
            )}
            <label className="block cursor-pointer text-xs text-accent hover:text-accent/80">
              Upload image
              <input type="file" name="image_file" accept="image/*" className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setImagePreview(URL.createObjectURL(f)) }}
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="h-10 text-white/40">Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-accent text-white hover:bg-accent/90 h-10 px-6">
              {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</> : <><Plus className="w-4 h-4 mr-2" />Create Section</>}
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-accent/40 hover:bg-accent/5 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Dynamic Section
        </button>
      )}
    </div>
  )
}
