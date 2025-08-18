import { Metadata } from 'next'

import { getCurrentUser } from '@/app/lib/jwt'
import Settingscomponent from './settingscomponent'
import { redirect } from 'next/navigation'
import { useContent } from '@/app/contexts/ContentContext'

export const metadata: Metadata = {
  title: 'Settings | ChrisWrldArena Dashboard',
  description: 'Manage your account settings and preferences',
  openGraph: {
    title: 'ChrisWrldArena - Expert Sports Predictions & Analysis',
    description: 'Get accurate sports predictions and expert analysis. Join our community of successful bettors.',
    url: 'https://chriswrldarena.com',
    siteName: 'ChrisWrldArena',
    images: [
      {
        url: 'https://chriswrldarena.com/img.png',
        width: 1200,
        height: 630,
        alt: 'ChrisWrldArena - Expert Sports Predictions & Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChrisWrldArena - Expert Sports Predictions & Analysis',
    description: 'Get accurate sports predictions and expert analysis. Join our community of successful bettors.',
    images: ['https://chriswrldarena.com/img.png'],
  },
  icons: {
    icon: 'https://chriswrldarena.com/favicon.ico',
    apple: 'https://chriswrldarena.com/img.png',
    other: [
      { rel: 'icon', url: 'https://chriswrldarena.com/img.png', sizes: '16x16' },
      { rel: 'icon', url: 'https://chriswrldarena.com/img.png', sizes: '32x32' },
      { rel: 'icon', url: 'https://chriswrldarena.com/img.png', sizes: '48x48' },
    ],
  },
  
  keywords: [
    'sports predictions',
    'expert analysis',
    'betting tips',
    'football predictions',
    'basketball predictions',
    'sports betting',
    'odds analysis',
    'winning strategies',
    'ChrisWrldArena'
  ],
  authors: [
    {
      name: 'Codeink Technologies',
      url: 'https://codeinktechnologies.com',
     // email: 'admin@codeinktechnologies.com'
    },
  ],
  creator: 'Codeink Technologies',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    noarchive: false,
    nosnippet: false,
  },

}

export default async function SettingsPage() {

  const user = await getCurrentUser()
  if (!user) { return redirect('/') }
 
  const currency = String(user?.location.currency || 'GHS')

  return (

    <div className="p-6 lg:p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>
      <Settingscomponent currency={currency} />
    </div>
  )

}
