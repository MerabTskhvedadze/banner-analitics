'use client'

import { Typography } from 'antd'

type PageHeaderProps = {
  title: string;
  subtitle: string;
  id?: string;
  className?: string;
}

const PageHeader = ({
  title,
  subtitle,
  id,
  className
}: PageHeaderProps) => {
  return (
    <div id={id} className={className}>
      <Typography.Title level={2} className='mb-2! text-2xl! leading-tight! sm:text-3xl! lg:text-4xl!'>
        {title}
      </Typography.Title>
      <Typography.Text className='block text-sm! leading-6! sm:text-base!' type='secondary'>
        {subtitle}
      </Typography.Text>
    </div>
  )
}

export default PageHeader
