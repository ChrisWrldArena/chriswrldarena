/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import HomePageComponent from './homepagecontent/HomeComponent';
import { homeData } from './actions/utils';
import { generateToken } from './lib/auth';

export const metadata: Metadata = {
  title: 'ChrisWrldArena - Expert Sports Predictions & Analysis',
  description: 'Get accurate sports predictions and expert analysis. Join our community of successful bettors.',
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
export const dynamic = 'force-dynamic'
export const revalidate = 0


export default async function HomePage() {
  const homedata = await homeData()
  
  return (
    <HomePageComponent content={homedata} />
  )
}
