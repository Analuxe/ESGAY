'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// We use the service role key here to bypass RLS for administrative actions.
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to check if email is admin, returning true/false
export async function checkIsAdmin(email?: string): Promise<boolean> {
  if (!email) return false
  const normalized = email.toLowerCase()
  if (normalized === 'khersak@icloud.com') return true

  try {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('email', normalized)
      .limit(1)
      .single()

    if (!error && data) return true
  } catch (e) {
    console.error('Error querying admins table:', e)
  }

  return false
}

// Server action guard - Returns error object if unauthorized, otherwise null
async function verifyAdmin() {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user || !user.email) {
    return { error: 'Unauthorized: restricted administrative credentials.' }
  }

  const isAdmin = await checkIsAdmin(user.email)
  if (!isAdmin) {
    return { error: 'Unauthorized: restricted administrative clearance level.' }
  }
  return null
}

// Fetch list of all dynamically added admins
export async function getAdmins() {
  const authErr = await verifyAdmin()
  if (authErr) {
    console.warn('Admins lookup unauthorized. Returning empty.')
    return []
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      // If table doesn't exist yet, return empty list gracefully rather than breaking
      console.warn('Admins table does not exist or fetch failed. Returning empty.')
      return []
    }
    return data || []
  } catch (e) {
    console.error('Error fetching admins list:', e)
    return []
  }
}

// Server Action to add a dynamic administrator
export async function addAdmin(formData: FormData) {
  const authErr = await verifyAdmin()
  if (authErr) return authErr

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email) {
    return { error: 'Email is required.' }
  }

  if (email === 'khersak@icloud.com') {
    return { error: 'This user is already the primary administrator.' }
  }

  const { error } = await supabaseAdmin
    .from('admins')
    .insert({ email })

  if (error) {
    console.error('Error adding admin:', error)
    return { error: `Failed to add admin: ${error.message}` }
  }

  revalidatePath('/command-center')
  return { success: true }
}

// Server Action to remove a dynamic administrator
export async function removeAdmin(id: string) {
  const authErr = await verifyAdmin()
  if (authErr) return authErr

  const { error } = await supabaseAdmin
    .from('admins')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error removing admin:', error)
    return { error: `Failed to remove admin: ${error.message}` }
  }

  revalidatePath('/command-center')
  return { success: true }
}

export async function createArtifact(formData: FormData) {
  const authErr = await verifyAdmin()
  if (authErr) return authErr

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priceInput = formData.get('price') as string
  const stockInput = formData.get('stock_count') as string
  const wing = formData.get('wing') as string
  
  if (!title || !description || !priceInput || !wing) {
    return { error: 'Missing required artifact metadata fields.' }
  }

  const price = parseFloat(priceInput)
  if (isNaN(price)) {
    return { error: 'Invalid price value: Must be a valid decimal number.' }
  }

  const stock_count = parseInt(stockInput || '1', 10)
  if (isNaN(stock_count)) {
    return { error: 'Invalid stock count: Must be a valid integer.' }
  }

  // Handle optional photo upload
  const photoFile = formData.get('photo') as File | null
  let image_url = null

  if (photoFile && photoFile.size > 0) {
    try {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const buffer = Buffer.from(await photoFile.arrayBuffer())

      // Auto-ensure public bucket exists
      try {
        await supabaseAdmin.storage.createBucket('artifact-images', {
          public: true
        })
      } catch (bucketErr) {
        // Ignore if bucket already exists
      }

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('artifact-images')
        .upload(fileName, buffer, {
          contentType: photoFile.type,
          upsert: true
        })

      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError)
        return { error: `Storage upload failed: ${uploadError.message}` }
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('artifact-images')
        .getPublicUrl(fileName)

      image_url = publicUrl
    } catch (uploadException: any) {
      console.error('Failed to handle photo upload:', uploadException)
      return { error: `Photo upload failed: ${uploadException.message}` }
    }
  }

  // Fetch a vendor or create one dynamically if none exist
  let vendorId = null

  try {
    const { data: vendorData } = await supabaseAdmin
      .from('vendors')
      .select('id')
      .limit(1)

    if (vendorData && vendorData.length > 0) {
      vendorId = vendorData[0].id
    } else {
      // No vendors exist. Let's create a default vendor to satisfy the foreign key constraint.
      console.warn('No vendors found. Creating default vendor "Divine Scavenger"...')
      const { data: newVendor, error: createVendorError } = await supabaseAdmin
        .from('vendors')
        .insert({
          moniker: 'Divine Scavenger',
          manifesto: 'We do not apologize for being too much.'
        })
        .select('id')
        .single()

      if (newVendor) {
        vendorId = newVendor.id
      } else {
        // If single failed due to unique constraint or other conflict, try fetching again
        const { data: existingVendor } = await supabaseAdmin
          .from('vendors')
          .select('id')
          .eq('moniker', 'Divine Scavenger')
          .limit(1)
          .single()
        vendorId = existingVendor?.id
      }
    }
  } catch (e) {
    console.error('Error selecting or creating vendor:', e)
  }

  // Dynamically detect if artifacts table expects image_url (text) or image_urls (text[])
  let hasImageUrl = true
  try {
    const { error: columnError } = await supabaseAdmin
      .from('artifacts')
      .select('image_url')
      .limit(1)

    if (columnError && (
      columnError.code === 'PGRST100' || 
      columnError.code === '42703' ||
      (columnError.message && (
        columnError.message.includes('column') && columnError.message.includes('does not exist')
      ))
    )) {
      hasImageUrl = false
    }
  } catch (e) {
    hasImageUrl = false
  }

  // Attempt to insert with the detected setting, but fall back dynamically if Postgres rejects it
  const insertPayload: any = {
    title,
    description,
    price,
    wing,
    stock_count,
    vendor_id: vendorId
  }

  if (hasImageUrl) {
    insertPayload.image_url = image_url
  } else {
    insertPayload.image_urls = image_url ? [image_url] : []
  }

  let { error: insertError } = await supabaseAdmin
    .from('artifacts')
    .insert(insertPayload)

  // If the query failed because our detection guessed the wrong column name, retry dynamically with the alternate column name!
  if (insertError && (
    insertError.code === '42703' || 
    (insertError.message && (
      insertError.message.includes('column') && insertError.message.includes('does not exist')
    ))
  )) {
    console.warn('Postgres column error during insert. Triggering fallback insert strategy...');
    const alternatePayload = { ...insertPayload }
    if (hasImageUrl) {
      delete alternatePayload.image_url
      alternatePayload.image_urls = image_url ? [image_url] : []
    } else {
      delete alternatePayload.image_urls
      alternatePayload.image_url = image_url
    }

    const { error: retryError } = await supabaseAdmin
      .from('artifacts')
      .insert(alternatePayload)
    
    insertError = retryError
  }

  if (insertError) {
    console.error('Error creating artifact after fallback attempts:', insertError)
    return { error: `Failed to create artifact in database: ${insertError.message}` }
  }

  revalidatePath('/command-center')
  revalidatePath(`/${wing}`)
  return { success: true }
}

export async function confiscateArtifact(id: string, currentStatus: boolean, wing: string) {
  const authErr = await verifyAdmin()
  if (authErr) return authErr

  const { error } = await supabaseAdmin
    .from('artifacts')
    .update({ is_confiscated: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('Error updating artifact:', error)
    return { error: `Failed to update artifact: ${error.message}` }
  }

  revalidatePath('/command-center')
  revalidatePath(`/${wing}`)
  return { success: true }
}
