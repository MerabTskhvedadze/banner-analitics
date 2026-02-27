'use client'

import { Suspense, useMemo, useState } from 'react'
import { Button, Typography, message } from 'antd'
import { MdArrowBack, MdMarkEmailRead } from 'react-icons/md'
import { useSearchParams } from 'next/navigation'
import { requestPasswordReset } from '@/lib/user-actions'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''
  const email = useMemo(() => emailParam.trim(), [emailParam])

  const [loading, setLoading] = useState(false)

  const onResend = async () => {
    setLoading(true)
    const res = await requestPasswordReset({ email })
    if (res.ok) message.success(res.message)
    else message.error(res.message)
    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="max-w-120 w-full bg-white dark:bg-background-dark/50 p-8 md:p-12 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
        <div className="mb-1 w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary">
          <MdMarkEmailRead className="text-5xl" />
        </div>

        <Typography.Title level={3} className='m-0!'>Check your email</Typography.Title>

        <Typography.Title level={5} type='secondary' className='m-0! my-4!'>
          If an account exists for{' '}
          <br />
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {email || 'your email'}
          </span>
          <br />
          you’ll receive a link.
        </Typography.Title>

        <Typography.Text type='secondary' className="leading-relaxed! mb-3.5!">
          New accounts get a verification link. Existing accounts may receive a password reset link so you can sign in.
          <Typography.Text type='warning'>
            (Check Spam/Promotions too)
          </Typography.Text>
        </Typography.Text>

        <div className="w-full space-y-6">
          <div className="flex flex-col gap-3">
            <Button
              size="large"
              type="primary"
              loading={loading}
              disabled={!email}
              onClick={onResend}
            >
              Send link again
            </Button>
          </div>

          <Typography.Link href="/auth/login" className="inline-flex items-center gap-1">
            <span>
              <MdArrowBack />
            </span>
            <span>Back to Login</span>
          </Typography.Link>
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CheckEmailContent />
    </Suspense>
  )
}