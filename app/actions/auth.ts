'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in production, use a library like zod to validate the input
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const consent = formData.get('gdpr_consent')
  if (!consent) {
    return { error: 'You must consent to the processing of your data to create an account.' }
  }

  const origin = headers().get('origin') || 'https://esgay.vercel.app'
  const redirectTo = `${origin}/auth/callback`

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        gdpr_consent: true,
        consent_date: new Date().toISOString(),
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Return success message instead of redirecting.
  // Next.js redirect() throws internally, and the client-side try/catch
  // in OnboardingFlow swallows it as an "unexpected error".
  // The user needs to confirm their email before they can authenticate anyway.
  return { success: 'Registration successful. Check your email to confirm your dossier.' }
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://esgay.vercel.app'}/auth/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Password reset link sent to your email.' }
}

export async function signout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

