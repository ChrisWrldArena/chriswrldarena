'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { redirect, usePathname, useRouter } from 'next/navigation'
import {
  HiHome,
  HiChartBar,
  HiCreditCard,
  HiUser,
  HiCog,
  HiSupport,
  HiMenu,
  HiX
} from 'react-icons/hi'
import { Edit, Users2Icon } from 'lucide-react'
import { FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { useDialog } from '../components/shared/dialog'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HiHome },
  { name: 'Payments', href: '/dashboard/payments', icon: HiCreditCard },
  { name: 'Predictions', href: '/dashboard/predictions', icon: HiChartBar },
  { name: 'Users', href: '/dashboard/users', icon: Users2Icon },
  { name: 'Profile', href: '/dashboard/profile', icon: HiUser },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const dialog = useDialog()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      redirect('/');      
    }

  }, [user]);


  return (
    <div className="fixed inset-0 min-h-screen bg-gray-50 z-[999] overflow-y-scroll">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-[999]">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-base uppercase font-bold text-gray-900">ChrisWrldArena</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <HiX className="w-6 h-6 text-gray-500" />
          ) : (
            <HiMenu className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-base font-bold text-gray-900 uppercase">ChrisWrldArena</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-green-700' : 'text-gray-400'
                    }`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <HiUser className="w-6 h-6 text-gray-500" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <FaSignOutAlt className="w-4 h-4 text-red-500 mt-1 cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => {
                    dialog.showDialog({
                      title: "Signout", message: "Do you want to sign out from this account?", type: "confirm", onConfirm: async () => {
                        await signOut()
                       window.location.href = "/"
                      }
                    })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 z-[999]">
        <main className="min-h-screen pt-16 lg:pt-0 ">
          {children}
        </main>
      </div>
    </div>
  )
}
