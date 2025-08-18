'use client'

import { useState } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Disclaimer() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'risks', title: 'Betting Risks' },
    { id: 'responsibility', title: 'Responsible Gambling' },
    { id: 'predictions', title: 'Prediction Accuracy' },
    { id: 'liability', title: 'Liability' },
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
              <div className="flex items-center gap-4 mb-6">
                <AlertTriangle className="w-12 h-12 text-green-600" />
                <h1 className="text-4xl font-bold text-gray-900">Betting Disclaimer</h1>
              </div>
              <p className="text-gray-600 mb-8">Last updated: July 11, 2025</p>

              <div className="prose prose-green max-w-none">
                <section id="overview" className={activeSection === 'overview' ? '' : 'hidden'}>
                  <h2>1. Overview</h2>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <p className="text-green-700">
                      ChrisWrldArena provides sports betting predictions and analysis for informational purposes only. We are not a gambling operator or bookmaker, and we do not accept or place bets.
                    </p>
                  </div>
                  <p>This disclaimer outlines important information about the risks associated with sports betting and your use of our predictions and analysis.</p>
                </section>

                <section id="risks" className={activeSection === 'risks' ? '' : 'hidden'}>
                  <h2>2. Betting Risks</h2>
                  <h3>2.1 Financial Risk</h3>
                  <p>Sports betting involves substantial risk of financial loss. You should:</p>
                  <ul>
                    <li>Never bet more than you can afford to lose</li>
                    <li>Consider betting as entertainment, not income</li>
                    <li>Understand that past performance does not guarantee future results</li>
                    <li>Be aware that all forms of gambling carry inherent risks</li>
                  </ul>

                  <h3>2.2 Legal Considerations</h3>
                  <p>You are responsible for:</p>
                  <ul>
                    <li>Verifying the legality of sports betting in your jurisdiction</li>
                    <li>Complying with all applicable laws and regulations</li>
                    <li>Paying any applicable taxes on winnings</li>
                    <li>Understanding local gambling restrictions</li>
                  </ul>
                </section>

                <section id="responsibility" className={activeSection === 'responsibility' ? '' : 'hidden'}>
                  <h2>3. Responsible Gambling</h2>
                  <h3>3.1 Warning Signs</h3>
                  <p>Be aware of problem gambling indicators:</p>
                  <ul>
                    <li>Betting more than you can afford</li>
                    <li>Chasing losses</li>
                    <li>Betting interfering with daily life</li>
                    <li>Borrowing money to bet</li>
                    <li>Lying about betting habits</li>
                  </ul>

                  <h3>3.2 Support Resources</h3>
                  <p>If you need help with problem gambling:</p>
                  <ul>
                    <li>Contact a gambling addiction helpline</li>
                    <li>Seek professional counseling</li>
                    <li>Use self-exclusion programs</li>
                    <li>Talk to friends and family</li>
                  </ul>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
                    <p className="text-green-700 font-medium">Need Help?</p>
                    <p className="text-green-600">Contact the National Problem Gambling Helpline: 1-800-522-4700</p>
                  </div>
                </section>

                <section id="predictions" className={activeSection === 'predictions' ? '' : 'hidden'}>
                  <h2>4. Prediction Accuracy</h2>
                  <h3>4.1 No Guarantees</h3>
                  <p>Our predictions and analysis:</p>
                  <ul>
                    <li>Are based on available data and expert analysis</li>
                    <li>Cannot guarantee specific outcomes</li>
                    <li>Should not be considered as financial advice</li>
                    <li>May not be suitable for all users</li>
                  </ul>

                  <h3>4.2 Decision Making</h3>
                  <p>Users should:</p>
                  <ul>
                    <li>Conduct their own research</li>
                    <li>Use predictions as one of many tools</li>
                    <li>Exercise independent judgment</li>
                    <li>Consider multiple factors before betting</li>
                  </ul>
                </section>

                <section id="liability" className={activeSection === 'liability' ? '' : 'hidden'}>
                  <h2>5. Liability</h2>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">
                      ChrisWrldArena is not liable for any financial losses incurred from using our predictions or analysis. Use our services at your own risk.
                    </p>
                  </div>

                  <h3>5.1 Disclaimer of Liability</h3>
                  <p>We are not responsible for:</p>
                  <ul>
                    <li>Betting losses or financial damages</li>
                    <li>Accuracy of third-party information</li>
                    <li>Decisions made based on our predictions</li>
                    <li>Legal consequences of betting activities</li>
                  </ul>

                  <h3>5.2 User Responsibility</h3>
                  <p>By using our services, you acknowledge:</p>
                  <ul>
                    <li>Full responsibility for your betting decisions</li>
                    <li>Understanding of betting risks</li>
                    <li>Compliance with local laws</li>
                    <li>Agreement to our terms and conditions</li>
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
