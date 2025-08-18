import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Users Management | ChrisWrldArena',
  description: 'Manage users and their subscriptions',
}

const UsersClient = dynamic(() => import('./UsersClient'), { ssr: true });

export default function UsersPage() {
  return <UsersClient />
}
