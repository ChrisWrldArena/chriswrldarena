import { SignupForm } from '@/app/components/auth/SignupForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | ChrisWrldArena',
  description: 'Create your ChrisWrldArena account',
}

export default function SignUpPage() {
  return <SignupForm/>
}