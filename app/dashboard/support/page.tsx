import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support | ChrisWrldArena',
  description: 'Get help and support for your account',
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

export default function SupportPage() {
  return (
    <div className="p-6 lg:p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
        <p className="mt-1 text-gray-600">Get help and support for your account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
  )
}
