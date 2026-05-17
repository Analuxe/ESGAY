'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// We use the service role key here to bypass RLS for administrative actions.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createArtifact(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const wing = formData.get('wing') as string
  const stock_count = parseInt(formData.get('stock_count') as string, 10)
  
  // For now, assign to "Divine Scavenger" or a default vendor for simplicity. 
  // In a full build, this would be a dropdown of vendors.
  const { data: vendorData } = await supabaseAdmin
    .from('vendors')
    .select('id')
    .limit(1)
    .single()

  const { error } = await supabaseAdmin
    .from('artifacts')
    .insert({
      title,
      description,
      price,
      wing,
      stock_count,
      vendor_id: vendorData?.id
    })

  if (error) {
    console.error('Error creating artifact:', error)
    throw new Error(`Failed to create artifact: ${error.message}`)
  }

  revalidatePath('/command-center')
  revalidatePath(`/${wing}`)
}

export async function confiscateArtifact(id: string, currentStatus: boolean, wing: string) {
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
