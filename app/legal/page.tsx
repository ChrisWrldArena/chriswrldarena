'use client'

import { useState } from 'react';
import { ArrowRight, Book, FileText, Scale, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LegalHub() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const legalDocs = [
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'Our terms and conditions for using ChrisWrldArena services',
      icon: <Scale className="w-6 h-6" />,
      href: '/legal/terms',
      color: 'from-green-950 to-green-950'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'How we handle and protect your personal information',
      icon: <Shield className="w-6 h-6" />,
      href: '/legal/privacy',
      color: 'from-green-950 to-green-950'
    },
    {
      id: 'eula',
      title: 'End User License Agreement',
      description: 'License terms for using our platform and services',
      icon: <FileText className="w-6 h-6" />,
      href: '/legal/eula',
      color: 'from-green-950 to-green-950'
    },
    {
      id: 'disclaimer',
      title: 'Betting Disclaimer',
      description: 'Important information about sports betting risks',
      icon: <Book className="w-6 h-6" />,
      href: '/legal/disclaimer',
      color: 'from-green-950 to-green-950'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center my-28">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Information</h1>
          <p className="text-xl text-gray-600">Important documents and policies for ChrisWrldArena users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {legalDocs.map((doc) => (
            <Link
              key={doc.id}
              href={doc.href}
              className="block"
              onMouseEnter={() => setHoveredCard(doc.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className={`absolute inset-0 bg-gradient-to-r ${doc.color} opacity-90`} />
                <div className="relative p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-white/20 rounded-lg p-3">
                      {doc.icon}
                    </div>
                    <div className="ml-5">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {doc.title}
                      </h3>
                      <p className="text-white/80">
                        {doc.description}
                      </p>
                    </div>
                    <ArrowRight 
                      className={`ml-auto w-6 h-6 text-white transition-transform duration-300 ${
                        hoveredCard === doc.id ? 'translate-x-2' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
