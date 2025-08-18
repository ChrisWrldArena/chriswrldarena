import { Metadata } from 'next'
import { SigninForm } from '@/app/components/auth/SigninForm'

export const metadata: Metadata = {
  title: 'Sign In | ChrisWrldArena',
  description: 'Sign in to your ChrisWrldArena account',
}
export default function SignInPage() {
  return <SigninForm />
}

