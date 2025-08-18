/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | ChrisWrldArena',
  description: 'Learn more about ChrisWrldArena and our sports prediction service',
}

export default function AboutPage() {
  return (
    <div className="relative mx-auto px-4 py-12">
      <div className="absolute inset-0 bg-cover bg-center h-64 shadow-lg -z-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #1a1818c0, #111010cb), url(/stadium.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>

      </div>
      <div className="max-w-4xl mx-auto mt-28 z-50">
        <h1 className="text-4xl font-bold mb-20 text-white">About ChrisWrldArena</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg mb-6">
            Welcome to ChrisWrldArena, your premier destination for expert sports predictions and analysis.
            Founded in 2023, we've committed ourselves to providing accurate, data-driven sports predictions
            to help our community make informed decisions.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-neutral-200 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Expert Analysis</h3>
              <p>Our team of experienced analysts combines statistical data with deep sports knowledge to deliver reliable predictions.</p>
            </div>
            <div className="bg-neutral-200 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Proven Track Record</h3>
              <p>We maintain a success rate that speaks for itself, with transparent reporting of our prediction accuracy.</p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-neutral-300 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li className="text-lg">Daily sports predictions across multiple leagues</li>
            <li className="text-lg">In-depth match analysis and statistics</li>
            <li className="text-lg">Expert betting tips and strategies</li>
            <li className="text-lg">Real-time updates and notifications</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-lg mb-6">
            We pride ourselves on maintaining the highest standards of integrity and transparency.
            Our predictions are based on thorough research, statistical analysis, and years of
            experience in sports analysis.
          </p>
        </section>

        <section className="border-t pt-8">
          <p className="text-center text-gray-600">
            Have questions? Contact us at{' '}
            <a href="mailto:chriswrld95@gmail.com" className="text-blue-600 hover:underline">
              chriswrld95@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
