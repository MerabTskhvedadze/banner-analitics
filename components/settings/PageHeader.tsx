'use client'

import { Typography } from 'antd'

const PageHeader = ({ title, subtitle }: { title: string, subtitle: string }) => {
  return (
    <>
      <Typography.Title level={2} className='mb-2!'>{title}</Typography.Title>
      <Typography.Text type='secondary'>{subtitle}</Typography.Text>
    </>
  )
}

export default PageHeader