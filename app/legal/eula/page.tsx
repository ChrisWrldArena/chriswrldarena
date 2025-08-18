'use client'

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EULA() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'license', title: 'License Grant' },
    { id: 'restrictions', title: 'Usage Restrictions' },
    { id: 'ownership', title: 'Ownership Rights' },
    { id: 'updates', title: 'Updates & Support' },
    { id: 'warranty', title: 'Warranty' },
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
              <h1 className="text-4xl font-bold text-gray-900 mb-6">End User License Agreement</h1>
              <p className="text-gray-600 mb-8">Last updated: July 11, 2025</p>

              <div className="prose prose-green max-w-none">
                <section id="overview" className={activeSection === 'overview' ? '' : 'hidden'}>
                  <h2>1. Overview</h2>
                  <p>This End User License Agreement (&ldquo;EULA&rdquo;) is a legal agreement between you and ChrisWrldArena governing the use of our platform and services. By using our services, you agree to be bound by this EULA.</p>
                </section>

                <section id="license" className={activeSection === 'license' ? '' : 'hidden'}>
                  <h2>2. License Grant</h2>
                  <h3>2.1 Scope of License</h3>
                  <p>Subject to the terms of this EULA, we grant you a limited, non-exclusive, non-transferable, revocable license to:</p>
                  <ul>
                    <li>Access and use our platform for personal, non-commercial use</li>
                    <li>View and utilize our predictions and analysis</li>
                    <li>Access premium features according to your subscription level</li>
                  </ul>

                  <h3>2.2 License Restrictions</h3>
                  <p>This license is subject to the following restrictions:</p>
                  <ul>
                    <li>Individual use only - no sharing of accounts</li>
                    <li>No commercial exploitation of our content</li>
                    <li>No unauthorized distribution of predictions</li>
                  </ul>
                </section>

                <section id="restrictions" className={activeSection === 'restrictions' ? '' : 'hidden'}>
                  <h2>3. Usage Restrictions</h2>
                  <p>You agree not to:</p>
                  <ul>
                    <li>Modify, reverse engineer, or decompile our platform</li>
                    <li>Create derivative works based on our content</li>
                    <li>Remove or alter any copyright notices</li>
                    <li>Use our platform for illegal gambling activities</li>
                    <li>Circumvent any access controls or security measures</li>
                    <li>Scrape or harvest data from our platform</li>
                  </ul>
                </section>

                <section id="ownership" className={activeSection === 'ownership' ? '' : 'hidden'}>
                  <h2>4. Ownership Rights</h2>
                  <h3>4.1 Intellectual Property</h3>
                  <p>All rights, title, and interest in and to the platform, including:</p>
                  <ul>
                    <li>Predictions and analysis content</li>
                    <li>Software and algorithms</li>
                    <li>Trademarks and logos</li>
                    <li>User interface and design</li>
                  </ul>
                  <p>are and will remain the exclusive property of ChrisWrldArena and its licensors.</p>

                  <h3>4.2 User Content</h3>
                  <p>You retain ownership of any content you submit to our platform, but grant us a worldwide, royalty-free license to use, modify, and distribute such content.</p>
                </section>

                <section id="updates" className={activeSection === 'updates' ? '' : 'hidden'}>
                  <h2>5. Updates & Support</h2>
                  <h3>5.1 Platform Updates</h3>
                  <p>We may provide updates, which may include:</p>
                  <ul>
                    <li>Bug fixes and performance improvements</li>
                    <li>New features and functionality</li>
                    <li>Security updates</li>
                  </ul>

                  <h3>5.2 Technical Support</h3>
                  <p>Support availability varies by subscription level and may include:</p>
                  <ul>
                    <li>Email support</li>
                    <li>Live chat assistance</li>
                    <li>Priority support for premium users</li>
                  </ul>
                </section>

                <section id="warranty" className={activeSection === 'warranty' ? '' : 'hidden'}>
                  <h2>6. Warranty</h2>
                  <h3>6.1 Disclaimer</h3>
                  <p>The platform is provided &ldquo;AS IS&rdquo; without any warranty of any kind. We do not guarantee:</p>
                  <ul>
                    <li>Accuracy of predictions</li>
                    <li>Uninterrupted service</li>
                    <li>Financial returns from using our tips</li>
                    <li>Compatibility with all devices</li>
                  </ul>

                  <h3>6.2 Limitation of Liability</h3>
                  <p>We shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our platform.</p>
                </section>

                <section id="termination" className={activeSection === 'termination' ? '' : 'hidden'}>
                  <h2>7. Termination</h2>
                  <h3>7.1 Termination Rights</h3>
                  <p>This EULA remains effective until terminated. We may terminate this EULA:</p>
                  <ul>
                    <li>Immediately for violations of this agreement</li>
                    <li>With notice for service discontinuation</li>
                    <li>For extended periods of account inactivity</li>
                  </ul>

                  <h3>7.2 Effect of Termination</h3>
                  <p>Upon termination:</p>
                  <ul>
                    <li>All rights granted under this EULA cease</li>
                    <li>Access to premium features ends</li>
                    <li>You must cease all use of our platform</li>
                    <li>Certain provisions survive termination</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
