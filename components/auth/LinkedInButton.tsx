'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from 'antd'
import { BsLinkedin } from 'react-icons/bs'

export function LinkedInButton({ next }: { next?: string }) {
  const supabase = createClient()

  const onLinkedIn = async () => {
    const callbackUrl = new URL("/auth/callback", window.location.origin)

    if (next && next.startsWith("/")) {
      callbackUrl.searchParams.set("next", next)
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: callbackUrl.toString(),
        scopes: "openid profile email",
      },
    })

    if (error) {
      console.error(error)
      return
    }

    // Important: do the redirect yourself
    if (data?.url) window.location.assign(data.url)
  }

  return (
    <Button
      htmlType="button"
      onClick={onLinkedIn}
      className="font-medium!"
      icon={<BsLinkedin className="text-primary! text-lg" />}
    >
      LinkedIn
    </Button>
  )
}
