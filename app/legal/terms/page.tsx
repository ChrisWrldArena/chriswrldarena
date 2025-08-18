/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Terms() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'services', title: 'Services' },
    { id: 'account', title: 'Account Terms' },
    { id: 'payments', title: 'Payments & Subscriptions' },
    { id: 'content', title: 'Content & Predictions' },
    { id: 'liability', title: 'Liability' },
    { id: 'termination', title: 'Termination' },
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
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
              <p className="text-gray-600 mb-8">Last updated: July 11, 2025</p>

              <div className="prose prose-green max-w-none">
                <section id="overview" className={activeSection === 'overview' ? '' : 'hidden'}>
                  <h2>1. Overview</h2>
                  <p>Welcome to ChrisWrldArena ("we," "our," or "us"). By accessing or using our website, mobile applications, and services, you agree to be bound by these Terms of Service ("Terms"). Please read these terms carefully before using our services.</p>
                  
                  <p>Our platform provides sports betting predictions, analysis, and related content. We are not a gambling operator or bookmaker, and we do not accept or place bets on behalf of our users.</p>
                </section>

                <section id="services" className={activeSection === 'services' ? '' : 'hidden'}>
                  <h2>2. Services</h2>
                  <p>Our services include but are not limited to:</p>
                  <ul>
                    <li>Sports predictions and betting tips</li>
                    <li>Match analysis and statistics</li>
                    <li>Premium content and VIP predictions</li>
                    <li>Educational resources about responsible betting</li>
                  </ul>

                  <h3>2.1 Service Availability</h3>
                  <p>We strive to maintain 24/7 service availability but cannot guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.</p>

                  <h3>2.2 Service Restrictions</h3>
                  <p>Our services are intended for individuals aged 18 or above. Users from jurisdictions where sports betting is illegal may not use our services for betting purposes.</p>
                </section>

                <section id="account" className={activeSection === 'account' ? '' : 'hidden'}>
                  <h2>3. Account Terms</h2>
                  <h3>3.1 Registration Requirements</h3>
                  <p>To create an account, you must:</p>
                  <ul>
                    <li>Be at least 18 years old</li>
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>

                  <h3>3.2 Account Security</h3>
                  <p>You are responsible for maintaining the confidentiality of your account credentials. Any suspected unauthorized access should be reported immediately.</p>
                </section>

                <section id="payments" className={activeSection === 'payments' ? '' : 'hidden'}>
                  <h2>4. Payments & Subscriptions</h2>
                  <h3>4.1 Subscription Plans</h3>
                  <p>We offer various subscription plans including:</p>
                  <ul>
                    <li>Daily Pass: 24-hour access to premium content</li>
                    <li>Weekly Pass: 7-day premium access</li>
                    <li>Monthly Pass: 30-day premium access</li>
                    <li>Annual Pass: 365-day premium access with additional benefits</li>
                  </ul>

                  <h3>4.2 Payment Terms</h3>
                  <p>All payments are processed securely through our payment partners. Subscription fees are non-refundable unless required by law. We reserve the right to modify pricing with notice to users.</p>

                  <h3>4.3 Automatic Renewal</h3>
                  <p>Subscriptions automatically renew unless canceled before the renewal date. Users can manage auto-renewal settings in their account dashboard.</p>
                </section>

                <section id="content" className={activeSection === 'content' ? '' : 'hidden'}>
                  <h2>5. Content & Predictions</h2>
                  <h3>5.1 Information Accuracy</h3>
                  <p>While we strive to provide accurate predictions and analysis, we cannot guarantee the outcome of any sporting event. Our predictions are based on analysis and should not be considered as guaranteed winning tips.</p>

                  <h3>5.2 Content Usage</h3>
                  <p>All content provided through our services is protected by copyright and other intellectual property rights. Users may not reproduce, distribute, or commercially exploit our content without explicit permission.</p>
                </section>

                <section id="liability" className={activeSection === 'liability' ? '' : 'hidden'}>
                  <h2>6. Liability</h2>
                  <h3>6.1 Disclaimer</h3>
                  <p>We provide predictions and analysis for informational purposes only. We are not responsible for any losses incurred from using our services. Users should exercise their own judgment and bet responsibly.</p>

                  <h3>6.2 Limitation of Liability</h3>
                  <p>Our liability is limited to the amount paid for our services in the previous 12 months. We are not liable for indirect, consequential, or special damages.</p>
                </section>

                <section id="termination" className={activeSection === 'termination' ? '' : 'hidden'}>
                  <h2>7. Termination</h2>
                  <h3>7.1 Account Termination</h3>
                  <p>We reserve the right to terminate or suspend accounts for:</p>
                  <ul>
                    <li>Violation of these Terms</li>
                    <li>Fraudulent or illegal activities</li>
                    <li>Non-payment of fees</li>
                    <li>Abuse of our services or other users</li>
                  </ul>

                  <h3>7.2 Effect of Termination</h3>
                  <p>Upon termination, access to premium services will cease immediately. Users remain liable for any outstanding payments.</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
