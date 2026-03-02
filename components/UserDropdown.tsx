import { Flex, Skeleton, Typography, Avatar } from 'antd'
import React from 'react'
import { MdPerson } from 'react-icons/md'

type UserDropdownProps = {
  isLoading: boolean,
  username: string,
  picture?: string
}

export default function UserDropdown({ isLoading, username, picture }: UserDropdownProps) {
  return (
    <Flex align="center" gap={8}>
      {isLoading ? (
        <>
          <Skeleton.Input active size="small" className="max-h-6" />
          <Skeleton.Avatar className="w-8! h-8!" />
        </>
      ) : (
        <>
          <Typography.Text className="font-semibold">
            {username}
          </Typography.Text>
          <Avatar
            icon={<MdPerson />}
            src={picture ?? undefined}
          />
        </>
      )}
    </Flex>
  )
}
