'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'

// ─── Fixed Section Actions ────────────────────────────────────────

export async function updateHomeContent(id: string, data: Record<string, unknown>) {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()
  const { error } = await supabase
    .from('home_content')
    .upsert({ id, data, updated_at: new Date().toISOString() }, { onConflict: 'id' })

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function getHomeContent(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('home_content')
    .select('data')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data.data as Record<string, unknown>
}

// ─── Hero ────────────────────────────────────────────────────────

export async function saveHeroSection(formData: FormData) {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()
  const existing = await getHomeContent('hero')

  // Handle image upload if provided
  let image_url = formData.get('image_url') as string
  const imageFile = formData.get('image_file') as File
  if (imageFile && imageFile.size > 0) {
    const fileName = `hero-${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`
    const buffer = await imageFile.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, { contentType: imageFile.type })
    if (uploadError) return { success: false, error: `Image upload failed: ${uploadError.message}` }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(uploadData.path)
    image_url = urlData.publicUrl
  }

  const payload = {
    ...(existing || {}),
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string,
    description: formData.get('description') as string,
    button_text: formData.get('button_text') as string,
    button_link: formData.get('button_link') as string,
    quote: formData.get('quote') as string,
    image_url,
  }

  const result = await updateHomeContent('hero', payload)
  return result
}

// ─── Featured Section ─────────────────────────────────────────────

export async function saveFeaturedSection(formData: FormData) {
  if (!(await isAdmin())) redirect('/login')
  const existing = await getHomeContent('featured')

  const payload = {
    ...(existing || {}),
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string,
    visible: formData.get('visible') === 'true',
    view_all_text: formData.get('view_all_text') as string,
    view_all_link: formData.get('view_all_link') as string,
  }

  return updateHomeContent('featured', payload)
}

// ─── About Section ────────────────────────────────────────────────

export async function saveAboutSection(formData: FormData) {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()
  const existing = await getHomeContent('about')

  let image_url = formData.get('image_url') as string
  const imageFile = formData.get('image_file') as File
  if (imageFile && imageFile.size > 0) {
    const fileName = `about-${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`
    const buffer = await imageFile.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, { contentType: imageFile.type })
    if (uploadError) return { success: false, error: `Image upload failed: ${uploadError.message}` }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(uploadData.path)
    image_url = urlData.publicUrl
  }

  const payload = {
    ...(existing || {}),
    text: formData.get('text') as string,
    image_url,
  }

  return updateHomeContent('about', payload)
}

// ─── Contact Section ──────────────────────────────────────────────

export async function saveContactSection(formData: FormData) {
  if (!(await isAdmin())) redirect('/login')
  const existing = await getHomeContent('contact')

  const payload = {
    ...(existing || {}),
    heading: formData.get('heading') as string,
    subheading: formData.get('subheading') as string,
    facebook_url: formData.get('facebook_url') as string,
    messenger_url: formData.get('messenger_url') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    location: formData.get('location') as string,
    maps_url: formData.get('maps_url') as string,
  }

  return updateHomeContent('contact', payload)
}

// ─── Dynamic Sections ─────────────────────────────────────────────

export async function createHomeSection(formData: FormData) {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()

  let image_url = ''
  const imageFile = formData.get('image_file') as File
  if (imageFile && imageFile.size > 0) {
    const fileName = `section-${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`
    const buffer = await imageFile.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, { contentType: imageFile.type })
    if (uploadError) return { success: false, error: `Image upload failed: ${uploadError.message}` }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(uploadData.path)
    image_url = urlData.publicUrl
  }

  // Get max sort_order
  const { data: maxRow } = await supabase
    .from('home_sections')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const sort_order = (maxRow?.sort_order ?? -1) + 1

  const { error } = await supabase.from('home_sections').insert({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    image_url,
    layout: formData.get('layout') as string || 'text-only',
    sort_order,
    visible: true,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/homepage')
  return { success: true }
}

export async function updateHomeSection(id: string, formData: FormData) {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()

  let image_url = formData.get('image_url') as string
  const imageFile = formData.get('image_file') as File
  if (imageFile && imageFile.size > 0) {
    const fileName = `section-${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`
    const buffer = await imageFile.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, { contentType: imageFile.type })
    if (uploadError) return { success: false, error: `Image upload failed: ${uploadError.message}` }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(uploadData.path)
    image_url = urlData.publicUrl
  }

  const { error } = await supabase.from('home_sections').update({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    image_url,
    layout: formData.get('layout') as string || 'text-only',
    visible: formData.get('visible') === 'true',
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/homepage')
  return { success: true }
}

export async function deleteHomeSection(id: string) {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()
  const { error } = await supabase.from('home_sections').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/homepage')
  return { success: true }
}

export async function reorderHomeSection(id: string, direction: 'up' | 'down') {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()

  const { data: current } = await supabase
    .from('home_sections')
    .select('id, sort_order')
    .eq('id', id)
    .single()

  if (!current) return { success: false, error: 'Section not found' }

  const { data: neighbor } = await supabase
    .from('home_sections')
    .select('id, sort_order')
    .order('sort_order', { ascending: direction === 'up' })
    .gt('sort_order', direction === 'down' ? current.sort_order : -1)
    .lt('sort_order', direction === 'up' ? current.sort_order : 9999)
    .limit(1)
    .single()

  // Simple approach: swap sort_order values
  if (!neighbor) return { success: true } // Already at edge

  const neighborOrder = neighbor.sort_order
  const currentOrder = current.sort_order

  await supabase.from('home_sections').update({ sort_order: neighborOrder }).eq('id', current.id)
  await supabase.from('home_sections').update({ sort_order: currentOrder }).eq('id', neighbor.id)

  revalidatePath('/')
  revalidatePath('/admin/homepage')
  return { success: true }
}
