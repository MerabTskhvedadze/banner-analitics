'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(values: any) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return { ok: false, message: "Invalid email or password." };
  }

  redirect("/dashboard");
}

// export async function signUp(formData: any) {
//   const supabase = await createClient()

//   const { email, password, confirmPassword, ...rest } = formData

//   // password matching re-check (more secured)
//   if (password !== confirmPassword) {
//     redirect('/auth/signup?error=password_mismatch')
//   }

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
//       data: { ...rest },
//     },
//   })

//   if (error) {
//     console.log(error)
//     redirect('/auth/signup?error=1')
//   }


//   if (!data.session) {
//     //* a page that tells user to verify
//     redirect("/auth/check-email")
//     return
//   }

//   // If you ever disable confirmat
//   redirect('/dashboard')
// }

export async function signUp(values: any) {
  const supabase = await createClient();

  const { email, password, confirmPassword, ...rest } = values;

  if (password !== confirmPassword) {
    return { ok: false, field: "confirmPassword", message: "Passwords do not match." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { ...rest },
    },
  });

  if (error) {
    // Show a safe message to the user
    // (Supabase may return different messages depending on settings)
    return { ok: false, message: error.message || "Sign up failed. Please try again." };
  }

  // If email confirmation is ON, session is usually null and you should show "check email"
  if (!data.session) {
    redirect(`/auth/check-email?email=${values.email}`);
  }

  redirect("/dashboard");
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

export async function requestPasswordReset(values: { email: string }) {
  const supabase = await createClient();

  const email = values.email?.trim();
  if (!email) {
    return { ok: false, message: "Please enter your email." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-callback`,
  });

  if (error) {
    return { ok: false, message: "Could not send an email right now. Please try again." };
  }

  return { ok: true, message: "If an account exists for this email, you’ll receive a reset link shortly." };
}

export async function setNewPassword(values: { password: string; confirm: string }) {
  const supabase = await createClient();

  const password = values.password || "";
  const confirm = values.confirm || "";

  if (password.length < 8) {
    return { ok: false, field: "password", message: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { ok: false, field: "confirm", message: "Passwords do not match." };
  }

  // Requires a valid recovery session (user opened the email link)
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { ok: false, message: error.message || "Could not update password. Please try again." };
  }

  // After successful update you can redirect
  redirect("/dashboard");
}