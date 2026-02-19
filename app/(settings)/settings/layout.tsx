import React from 'react'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Settings layout</h1>
      {children}
    </div>
  )
}
