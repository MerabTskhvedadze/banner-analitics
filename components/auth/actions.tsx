'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: any) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ ...formData })

  if (error) {
    redirect('/auth/login?error=1')
  }

  redirect('/dashboard')
}

export async function signUp(formData: any) {
  const supabase = await createClient()

  const { email, password, confirmPassword, ...rest } = formData

  if (password !== confirmPassword) {
    redirect('/auth/signup?error=password_mismatch')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: { ...rest },
    },
  })

  if (error) {
    console.log(error)
    redirect('/auth/signup?error=1')
  }

  redirect('/auth/check-email')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}