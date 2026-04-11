'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/get-user-role'

export type TeamMember = {
  id: string
  name: string
  role: string
  category: 'host' | 'admin' | 'assistant' | 'rider'
  image_url: string | null
  description: string | null
  status: 'active' | 'inactive'
  created_at?: string
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error("Error fetching team members:", error)
    return []
  }
  return data || []
}

export async function createTeamMember(formData: FormData) {
  if (!(await isAdmin())) return { success: false, error: 'Unauthorized' }

  const supabase = await createClient()
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  let image_url = formData.get('image_url') as string

  // Handle uploaded image file
  const imageFile = formData.get('imageFile') as File | null
  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('public') // Assuming a 'public' bucket or you can specify 'avatars'
      .upload(`team/${fileName}`, imageFile, { contentType: imageFile.type })
      
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('public').getPublicUrl(`team/${fileName}`)
      image_url = urlData.publicUrl
    }
  }

  if (!name || !role || !category) return { success: false, error: 'Missing required fields' }

  const { error } = await supabase.from('team_members').insert({
    name, role, category, description, image_url, status
  })

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/team')
  revalidatePath('/admin/team')
  return { success: true }
}

export async function updateTeamMember(id: string, formData: FormData) {
  if (!(await isAdmin())) return { success: false, error: 'Unauthorized' }

  const supabase = await createClient()
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  let image_url = formData.get('image_url') as string

  const imageFile = formData.get('imageFile') as File | null
  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('public')
      .upload(`team/${fileName}`, imageFile, { contentType: imageFile.type })
      
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('public').getPublicUrl(`team/${fileName}`)
      image_url = urlData.publicUrl
    }
  }

  const { error } = await supabase.from('team_members').update({
    name, role, category, description, image_url, status
  }).eq('id', id)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/team')
  revalidatePath('/admin/team')
  return { success: true }
}

export async function deleteTeamMember(id: string) {
  if (!(await isAdmin())) return { success: false, error: 'Unauthorized' }
  const supabase = await createClient()
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/team')
  revalidatePath('/admin/team')
  return { success: true }
}
