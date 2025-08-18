'use client'

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Privacy() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'collection', title: 'Data Collection' },
    { id: 'usage', title: 'Data Usage' },
    { id: 'sharing', title: 'Data Sharing' },
    { id: 'security', title: 'Data Security' },
    { id: 'rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies Policy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <Link 
          href="/legal"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Legal Hub
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
              <p className="text-gray-600 mb-8">Last updated: July 11, 2025</p>

              <div className="prose prose-green max-w-none">
                <section id="overview" className={activeSection === 'overview' ? '' : 'hidden'}>
                  <h2>1. Overview</h2>
                  <p>At ChrisWrldArena, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
                </section>

                <section id="collection" className={activeSection === 'collection' ? '' : 'hidden'}>
                  <h2>2. Data Collection</h2>
                  <h3>2.1 Information You Provide</h3>
                  <ul>
                    <li>Account information (name, email, username)</li>
                    <li>Payment information (processed securely by our payment partners)</li>
                    <li>Profile information</li>
                    <li>Communication preferences</li>
                  </ul>

                  <h3>2.2 Automatically Collected Information</h3>
                  <ul>
                    <li>Device information</li>
                    <li>Usage data</li>
                    <li>Location data</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                </section>

                <section id="usage" className={activeSection === 'usage' ? '' : 'hidden'}>
                  <h2>3. Data Usage</h2>
                  <p>We use your information to:</p>
                  <ul>
                    <li>Provide and improve our services</li>
                    <li>Process payments and subscriptions</li>
                    <li>Send notifications about predictions and updates</li>
                    <li>Analyze user behavior and optimize our platform</li>
                    <li>Comply with legal obligations</li>
                    <li>Prevent fraud and abuse</li>
                  </ul>
                </section>

                <section id="sharing" className={activeSection === 'sharing' ? '' : 'hidden'}>
                  <h2>4. Data Sharing</h2>
                  <h3>4.1 Third-Party Service Providers</h3>
                  <p>We may share your information with:</p>
                  <ul>
                    <li>Payment processors</li>
                    <li>Analytics providers</li>
                    <li>Cloud service providers</li>
                    <li>Customer support services</li>
                  </ul>

                  <h3>4.2 Legal Requirements</h3>
                  <p>We may disclose your information if required by law or to protect our rights and safety.</p>
                </section>

                <section id="security" className={activeSection === 'security' ? '' : 'hidden'}>
                  <h2>5. Data Security</h2>
                  <p>We implement appropriate security measures including:</p>
                  <ul>
                    <li>Encryption of sensitive data</li>
                    <li>Regular security assessments</li>
                    <li>Access controls and authentication</li>
                    <li>Secure data storage and transmission</li>
                  </ul>
                </section>

                <section id="rights" className={activeSection === 'rights' ? '' : 'hidden'}>
                  <h2>6. Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request data deletion</li>
                    <li>Object to data processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent</li>
                  </ul>
                </section>

                <section id="cookies" className={activeSection === 'cookies' ? '' : 'hidden'}>
                  <h2>7. Cookies Policy</h2>
                  <h3>7.1 Types of Cookies We Use</h3>
                  <ul>
                    <li>Essential cookies for site functionality</li>
                    <li>Analytics cookies to improve our service</li>
                    <li>Preference cookies to remember your settings</li>
                    <li>Marketing cookies for targeted advertising</li>
                  </ul>

                  <h3>7.2 Cookie Management</h3>
                  <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect site functionality.</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
