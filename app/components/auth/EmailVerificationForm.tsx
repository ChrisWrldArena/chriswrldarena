'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export function EmailVerificationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [isResending, setIsResending] = useState(false)

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (token && email) {
      verifyEmail(token, email)

    } else {
      setStatus('error')
    }
  }, [token, email])

  const verifyEmail = async (token: string, email: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      })

      if (response.ok) {
        setStatus('success')
        router.replace('/')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const resendVerification = async () => {
    if (!email || isResending) return

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        // Show success message
        window.location.href = "/"
        router.replace('/')
      }
    } catch (error: any) {
      // Show error message
      console.log(error.message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Email Verification</h2>
          {status === 'loading' && (
            <div className="mt-4">
              <p className="text-gray-600">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-4">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Email verified successfully!</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/signin"
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  Click here to sign in
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      Verification failed. The link may be expired or invalid.
                    </p>
                  </div>
                </div>
              </div>
              {email && (
                <button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="mt-4 text-green-600 hover:text-green-500 font-medium disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend verification email'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
