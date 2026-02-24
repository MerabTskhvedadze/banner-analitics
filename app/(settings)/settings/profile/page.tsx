import PageHeader from '@/components/settings/PageHeader'
import { Divider } from 'antd'
import React from 'react'

export default function page() {
  return (
    <div>
      <PageHeader
        title='Profile Settings'
        subtitle='Update your personal information'
      />

      <Divider />
    </div>
  )
}
