'use client'

import { useState, useTransition } from 'react'
import { useToast } from '@/hooks/use-toast'
import { saveContactSection } from './actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Facebook, MessageCircle, Phone, Mail, MapPin, Map } from 'lucide-react'

interface ContactData {
  heading?: string
  subheading?: string
  facebook_url?: string
  messenger_url?: string
  phone?: string
  email?: string
  location?: string
  maps_url?: string
}

export function ContactEditor({ initialData }: { initialData: ContactData }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await saveContactSection(formData)
      if (result.success) {
        toast({ title: 'Contact section saved!', description: 'Changes are live on the home page.' })
      } else {
        toast({ variant: 'destructive', title: 'Save failed', description: result.error })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2 col-span-full">
          <Label htmlFor="contact-heading" className="text-white/80">Section Heading</Label>
          <Input
            id="contact-heading"
            name="heading"
            defaultValue={initialData.heading}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="e.g. Connect with Jeany's Olshoppe"
          />
        </div>

        <div className="space-y-2 col-span-full">
          <Label htmlFor="contact-subheading" className="text-white/80">Subheading</Label>
          <Textarea
            id="contact-subheading"
            name="subheading"
            defaultValue={initialData.subheading}
            rows={2}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-facebook" className="text-white/80 flex items-center gap-2">
            <Facebook className="w-3.5 h-3.5 text-blue-400" /> Facebook URL
          </Label>
          <Input
            id="contact-facebook"
            name="facebook_url"
            defaultValue={initialData.facebook_url}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-messenger" className="text-white/80 flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-accent" /> Messenger URL
          </Label>
          <Input
            id="contact-messenger"
            name="messenger_url"
            defaultValue={initialData.messenger_url}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="https://m.me/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone" className="text-white/80 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-accent" /> Phone Number
          </Label>
          <Input
            id="contact-phone"
            name="phone"
            defaultValue={initialData.phone}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="0917 000 0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-white/80 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-accent" /> Email Address
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            defaultValue={initialData.email}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-location" className="text-white/80 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-red-400" /> Location Text
          </Label>
          <Input
            id="contact-location"
            name="location"
            defaultValue={initialData.location}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="Mapandan, Pangasinan, Philippines"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-maps" className="text-white/80 flex items-center gap-2">
            <Map className="w-3.5 h-3.5 text-red-400" /> Google Maps URL
          </Label>
          <Input
            id="contact-maps"
            name="maps_url"
            defaultValue={initialData.maps_url}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="bg-accent text-white hover:bg-accent/90 h-10 px-6">
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : 'Save Contact Section'}
        </Button>
      </div>
    </form>
  )
}
