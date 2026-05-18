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

// Server action guard
async function verifyAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    throw new Error('Unauthorized: restricted administrative command.')
  }

  const isAdmin = await checkIsAdmin(user.email)
  if (!isAdmin) {
    throw new Error('Unauthorized: restricted administrative command.')
  }
}

// Fetch list of all dynamically added admins
export async function getAdmins() {
  await verifyAdmin()
  
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
  await verifyAdmin()

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email) {
    throw new Error('Email is required.')
  }

  if (email === 'khersak@icloud.com') {
    throw new Error('This user is already the primary administrator.')
  }

  const { error } = await supabaseAdmin
    .from('admins')
    .insert({ email })

  if (error) {
    console.error('Error adding admin:', error)
    throw new Error(`Failed to add admin: ${error.message}`)
  }

  revalidatePath('/command-center')
}

// Server Action to remove a dynamic administrator
export async function removeAdmin(id: string) {
  await verifyAdmin()

  const { error } = await supabaseAdmin
    .from('admins')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error removing admin:', error)
    throw new Error(`Failed to remove admin: ${error.message}`)
  }

  revalidatePath('/command-center')
}

export async function createArtifact(formData: FormData) {
  await verifyAdmin()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const wing = formData.get('wing') as string
  const stock_count = parseInt(formData.get('stock_count') as string, 10)
  
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
        throw new Error(`Storage upload failed: ${uploadError.message}`)
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('artifact-images')
        .getPublicUrl(fileName)

      image_url = publicUrl
    } catch (uploadException: any) {
      console.error('Failed to handle photo upload:', uploadException)
      throw new Error(`Photo upload failed: ${uploadException.message}`)
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
      columnError.message.includes('column') && columnError.message.includes('does not exist')
    )) {
      hasImageUrl = false
    }
  } catch (e) {
    hasImageUrl = false
  }

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

  const { error } = await supabaseAdmin
    .from('artifacts')
    .insert(insertPayload)

  if (error) {
    console.error('Error creating artifact:', error)
    throw new Error(`Failed to create artifact: ${error.message}`)
  }

  revalidatePath('/command-center')
  revalidatePath(`/${wing}`)
}

export async function confiscateArtifact(id: string, currentStatus: boolean, wing: string) {
  await verifyAdmin()

  const { error } = await supabaseAdmin
    .from('artifacts')
    .update({ is_confiscated: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('Error updating artifact:', error)
    throw new Error(`Failed to update artifact: ${error.message}`)
  }

  revalidatePath('/command-center')
  revalidatePath(`/${wing}`)
}

