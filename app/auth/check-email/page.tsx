'use client'

import { Button, Typography } from 'antd'
import { MdArrowBack, MdMail, MdMarkEmailRead } from 'react-icons/md'

export default function page() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="max-w-120 w-full bg-white dark:bg-background-dark/50 p-8 md:p-12 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">

        {/* <!-- Icon Illustration Area --> */}
        <div className="mb-8 w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary">
          <MdMarkEmailRead className='text-5xl' />
        </div>

        {/* <!-- Content --> */}
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4">Check your inbox</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
          We’ve sent a verification link to <br />
          <span className="font-semibold text-slate-900 dark:text-slate-200">user@example.com</span>
        </p>
        <p className="text-slate-500 dark:text-slate-500 text-sm leading-relaxed mb-10">
          Please click the link in the email to activate your account and get started with our platform.
        </p>

        {/* <!-- Action Area --> */}
        <div className="w-full space-y-6">
          <div className="flex flex-col gap-3">
            <Button
              size='large'
              type="primary"
              onClick={() => console.log('resend')}
            >
              Resend Verification Email
            </Button>
          </div>

          <Typography.Link href='/auth/login' className='inline-flex items-center gap-1'>
            <span><MdArrowBack /></span>
            <span>Back to Login</span>
          </Typography.Link>
        </div>
      </div>
    </main>
  )
}
