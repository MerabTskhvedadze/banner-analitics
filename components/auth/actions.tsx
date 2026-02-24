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

  // password matching re-check (more secured)
  if (password !== confirmPassword) {
    redirect('/auth/signup?error=password_mismatch')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { ...rest },
    },
  })

  if (error) {
    console.log(error)
    redirect('/auth/signup?error=1')
  }


  if (!data.session) {
    //* a page that tells user to verify
    redirect("/auth/check-email")
    return
  }

  // If you ever disable confirmat
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function signInLinkedIn() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "linkedin_oidc",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      // optional but often used:
      // scopes: "openid profile email",
    },
  });

  if (error) console.error(error);
}