import { Metadata } from 'next'
import BlogDetailsClient from './BlogDetailsClient'

export const metadata: Metadata = {
    title: 'Blog Details | ChrisWrldArena',
    description: 'Read and engage with blog content',
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

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <BlogDetailsClient id={id} />
        </div>
    )
}
