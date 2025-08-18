import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
    return (
        <div className="fixed inset-0 min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12 z-[9999]">
            <div className="max-w-xl w-full text-center">
                {/* 404 Image */}
                <div className="relative w-64 h-52 mx-auto mb-2 -mt-24">
                    <Image
                        src="/404-illustration.svg"
                        alt="404 Illustration"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Error Message */}
                <h1 className="text-6xl font-bold text-gray-900 mb-4">
                    4
                    <span className="text-blue-600 inline-block animate-bounce mx-2">0</span>
                    4
                </h1>

                {/* Description */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Oops! Page not found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    The page you&apos;re looking for might have been removed, had its name changed,
                    or is temporarily unavailable.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                        Go Home
                        <svg
                            className="ml-2 -mr-1 w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                    </Link>


                </div>

                {/* Quick Links */}
                <div className="mt-12">
                    <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/predictions"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Predictions
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/blog"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            About Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
