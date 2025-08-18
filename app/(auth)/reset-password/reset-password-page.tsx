'use client'

import { Suspense } from 'react'
import { ResetPasswordForm } from '@/app/components/auth/ResetPasswordForm'
import { ResetPasswordWithToken } from '@/app/components/auth/ResetPasswordWithToken'
import { useSearchParams } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    return token ? <ResetPasswordWithToken /> : <ResetPasswordForm />
}

export default function ResetPasswordPage() {
    return (
        <Suspense 
            fallback={
                <div className="flex justify-center items-center min-h-screen">
                    <LoaderCircle className="animate-spin size-8" />
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    )
}
