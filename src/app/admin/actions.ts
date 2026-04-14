'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isSuperAdmin, isAdmin } from '@/lib/get-user-role'

// ─── Product Actions ───────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const condition = formData.get('condition') as string
  const stock_qty = parseInt(formData.get('stock_qty') as string) || 1
  const is_featured = formData.get('is_featured') === 'on'
  const imageFiles = formData.getAll('images') as File[]

  if (!name || isNaN(price)) {
    return { success: false, error: 'Name and price are required' }
  }

  // Upload images to Supabase Storage
  const imageUrls: string[] = []
  for (const file of imageFiles) {
    if (file.size === 0) continue
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const buffer = await file.arrayBuffer()
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, { contentType: file.type })

    if (error) return { success: false, error: `Image upload failed: ${error.message}` }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)
    imageUrls.push(urlData.publicUrl)
  }

  const { error } = await supabase.from('products').insert({
    name,
    description,
    price,
    category,
    condition,
    stock_qty,
    is_featured,
    images: imageUrls,
    created_by: user?.id,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const condition = formData.get('condition') as string
  const stock_qty = parseInt(formData.get('stock_qty') as string) || 1
  const is_featured = formData.get('is_featured') === 'on'
  const is_archived = formData.get('is_archived') === 'on'
  const existingImages = formData.getAll('existing_images') as string[]
  const imageFiles = formData.getAll('images') as File[]

  const imageUrls = [...existingImages]
  for (const file of imageFiles) {
    if (file.size === 0) continue
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const buffer = await file.arrayBuffer()
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, { contentType: file.type })
    if (error) return { success: false, error: error.message }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
    imageUrls.push(urlData.publicUrl)
  }

  const { error } = await supabase.from('products').update({
    name, description, price, category, condition, stock_qty,
    is_featured, is_archived, images: imageUrls,
  }).eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}

export async function archiveProduct(id: string, archive: boolean) {
  if (!(await isAdmin())) redirect('/login')
  const supabase = await createClient()
  const { error } = await supabase.from('products').update({ is_archived: archive }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}

export async function deleteProduct(id: string) {
  if (!(await isAdmin())) return { success: false, error: 'Unauthorized' }
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}

export async function updateProductBadge(id: string, badge: string | null) {
  if (!(await isAdmin())) return { success: false, error: 'Unauthorized' }
  const supabase = await createClient()
  const { error } = await supabase.from('products').update({ badge }).eq('id', id)
  
  // Also adjust stock_qty if marked as sold strictly through badge logic
  if (badge && badge.toLowerCase() === 'sold') {
    await supabase.from('products').update({ stock_qty: 0 }).eq('id', id)
  }
  
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true }
}

// ─── User / Role Actions ──────────────────────────────────────────

export async function updateUserRole(userId: string, role: 'user' | 'admin' | 'super_admin') {
  if (!(await isSuperAdmin())) return { success: false, error: 'Unauthorized' }
  const supabase = await createClient()
  const { error } = await supabase.from('people').update({ role }).eq('id', userId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(userId: string) {
  if (!(await isSuperAdmin())) return { success: false, error: 'Unauthorized' }
  
  const adminAuthClient = require('@supabase/supabase-js').createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  
  // Deleting from auth.users cascades to people usually, but we delete from people to be safe
  const supabase = await createClient()
  await supabase.from('people').delete().eq('id', userId)

  const { error } = await adminAuthClient.auth.admin.deleteUser(userId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function createAdminUser(formData: FormData) {
  if (!(await isSuperAdmin())) return { success: false, error: 'Unauthorized' }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const role = formData.get('role') as string;

  if (!email || !password || !firstName || !lastName || !role) {
    return { success: false, error: 'All fields are required.' };
  }

  // Use the Service Role Key to create the user without logging the current Admin out
  const adminAuthClient = require('@supabase/supabase-js').createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: newUser, error: createError } = await adminAuthClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`.trim(),
    }
  });

  if (createError) {
    return { success: false, error: createError.message };
  }

    if (newUser?.user) {
      const { error: profileError } = await adminAuthClient.from('people').upsert({
        id: newUser.user.id,
        email: newUser.user.email,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        role: role
      }, { onConflict: 'id' })

    if (profileError) {
      // Cleanup if profile creation fails
      await adminAuthClient.auth.admin.deleteUser(newUser.user.id);
      return { success: false, error: profileError.message };
    }
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function createRiderUser(formData: FormData) {
  if (!(await isSuperAdmin())) return { success: false, error: 'Unauthorized' }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const phone = formData.get('phone') as string;

  if (!email || !password || !firstName || !lastName || !phone) {
    return { success: false, error: 'All fields are required.' };
  }

  const adminAuthClient = require('@supabase/supabase-js').createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: newUser, error: createError } = await adminAuthClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      full_name: `${firstName} ${lastName}`.trim(),
    }
  });

  if (createError) {
    return { success: false, error: createError.message };
  }

    if (newUser?.user) {
      const { error: profileError } = await adminAuthClient.from('people').upsert({
        id: newUser.user.id,
        email: newUser.user.email,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        role: 'rider'
      }, { onConflict: 'id' })

    if (profileError) {
      await adminAuthClient.auth.admin.deleteUser(newUser.user.id);
      return { success: false, error: profileError.message };
    }
    
    // We can't insert into a riders table without knowing if it exists. 
    // We will just store user role 'rider'. Later, we can add a rider_profiles table.
  }

  revalidatePath('/admin/riders');
  return { success: true };
}

// ─── Map & Logistics Actions ───────────────────────────────────────

export async function saveBuyerLocation(formData: FormData) {
  if (!(await isSuperAdmin())) return { success: false, error: 'Unauthorized' }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const landmark = formData.get('landmark') as string;
  const lat = parseFloat(formData.get('latitude') as string);
  const lng = parseFloat(formData.get('longitude') as string);

  if (!name || !description || isNaN(lat) || isNaN(lng)) {
    return { success: false, error: 'Missing required location fields.' };
  }

  const supabase = await createClient()
  
  const { error } = await supabase.from('buyers_locations').insert({
    name,
    description,
    landmark: landmark || null,
    latitude: lat,
    longitude: lng
  })

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/map');
  return { success: true };
}

export async function getBuyerLocations() {
  const supabase = await createClient()
  // No strict auth requirement on fetch here, assumed to be checked at page level
  const { data, error } = await supabase
    .from('buyers_locations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching map locations:", error);
    return [];
  }
  return data;
}

export async function getLiveRiders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('people')
    .select(`
      id,
      full_name,
      rider_statuses (
        latitude,
        longitude,
        status,
        updated_at
      )
    `)
    .eq('role', 'rider');

  if (error) {
    console.error("Error fetching live riders:", error);
    return [];
  }
  
  return data || [];
}
