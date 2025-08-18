'use client'

import { useEffect, useState, useTransition } from 'react'

export default function ProgressBar() {
  const [width, setWidth] = useState(0)
  const [isPending] = useTransition()

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isPending) {
      setWidth(20)
    } else if (width !== 0) {
      setWidth(100)
      timeout = setTimeout(() => setWidth(0), 300)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${width}%`,
        background: '#29D',
        transition: 'width 200ms ease-out',
        zIndex: 9999,
      }}
    />
  )
}
