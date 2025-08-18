import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | ChrisWrldArena',
  description: 'Get in touch with ChrisWrldArena team',
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

export default function ContactPage() {
  return (
    <div className=" relative mx-auto px-4 py-12">
      <div className="absolute inset-0 bg-cover bg-center h-64 shadow-lg -z-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #1a1818c0, #111010cb), url(/stadium.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>

      </div>
      <div className="container mx-auto mt-28 z-50">
        <h1 className="text-4xl font-bold mb-20 text-white">Contact Us</h1>
        <div className="max-w-4xl mx-auto bg-neutral-100 rounded-lg p-8 backdrop-blur-sm bg-opacity-90 mt-28">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Direct Contact Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Direct Contact
              </h3>
              <div className="space-y-4">
                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+233240646729" target='_blank' className="text-gray-600 hover:text-green-600 transition-colors duration-300">
                      +233240646729
                    </a>
                  </p>
                </div>

                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    <a href="https://wa.me/+233240646729" target='_blank' className="text-gray-600 hover:text-green-600 transition-colors duration-300">
                      WhatsApp
                    </a>
                  </p>
                </div>

                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:chriswrld95@gmail.com" target='_blank' className="text-gray-600 hover:text-red-600 transition-colors duration-300">
                      chriswrld95@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Social Media
              </h3>
              <div className="space-y-4">
                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-start space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.039 18.845c-.943.02-1.875-.177-2.746-.574l-3.85 1.004 1.027-3.744c-.445-.92-.664-1.934-.664-2.979 0-3.794 3.085-6.87 6.878-6.87 3.794 0 6.878 3.076 6.878 6.87 0 3.793-3.084 6.87-6.878 6.87z" />
                    </svg>
                    <span suppressHydrationWarning className="flex flex-col space-y-2">
                      <a href="https://t.me/Chriswrldarena1" target='_blank' className="text-gray-600 hover:text-green-500 transition-colors duration-300">Channel</a>
                      <a href="https://t.me/+AH9nKCytD7k2YWE8" target='_blank' className="text-gray-600 hover:text-green-500 transition-colors duration-300">@Chriswrldarena1</a>
                      <a href="https://t.me/@chriswrld2" target='_blank' className="text-gray-600 hover:text-green-500 transition-colors duration-300">Group Link</a>
                    </span>
                  </p>
                </div>

                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <a href="https://x.com/chriswrld233?s=21" target='_blank' className="text-gray-600 hover:text-green-400 transition-colors duration-300">
                      @ChrisWrldArena
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      <div className="container mx-auto p-6 lg:p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="mt-1 text-gray-600">Get help and support for your account.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-100 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-6">
                    <h3 className="text-base font-medium text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-sm text-gray-500">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Contact Us</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {method.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                        <p className="mt-1">
                          <button className="text-sm font-medium text-green-600 hover:text-green-500">
                            {method.action}
                          </button>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Support Ticket */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Submit a Support Ticket</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="What can we help you with?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Describe your issue..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700  focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}


const faqs = [
  {
    question: 'How do I get started with predictions?',
    answer: 'To get started with predictions, simply navigate to the Predictions section in your dashboard. You can view available predictions, track your success rate, and manage your preferences. We recommend starting with our beginner-friendly tips and gradually progressing to more advanced strategies.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards including Visa, Mastercard, and American Express. We also support various digital payment methods. All payments are processed securely through our payment provider.',
  },
  {
    question: 'How can I cancel my subscription?',
    answer: 'You can cancel your subscription at any time from your account settings. Go to Payments > Current Plan and click on "Cancel Subscription". Your access will continue until the end of your current billing period.',
  },
  {
    question: 'What is included in the VIP subscription?',
    answer: 'VIP subscribers get access to premium predictions, detailed analysis, real-time notifications, and priority support. You also get exclusive access to our expert tips and community features.',
  },
]

const contactMethods = [
  {
    name: 'Email Support',
    description: 'Get in touch with our support team via email.',
    icon: (
      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    action: 'chriswrld95@gmail.com',
  },
  {
    name: 'Live Chat',
    description: 'Chat with our support team in real-time.',
    icon: (
      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    action: 'Start Chat',
  },
  {
    name: 'Phone Support',
    description: 'Available Monday to Friday, 9AM-5PM EST',
    icon: (
      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    action: '+233 24 064 6729',
  },
]


