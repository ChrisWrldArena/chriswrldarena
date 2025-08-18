import { EmailVerificationForm } from '@/app/components/auth/EmailVerificationForm'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Verify Email | ChrisWrldArena',
  description: 'Verify your email address',
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationForm />
    </Suspense>
  )
}
