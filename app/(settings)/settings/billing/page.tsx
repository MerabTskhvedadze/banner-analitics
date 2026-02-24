import PageHeader from '@/components/settings/PageHeader'
import { Divider } from 'antd'
import React from 'react'

export default function page() {
  return (
    <div>
      <PageHeader
        title='Billing & Tokens'
        subtitle='Manage your token balance, payment methods and billing history'
      />

      <Divider />
    </div>
  )
}
