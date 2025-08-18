/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, Loader2, User2, LogIn, Home, UserCheck2, LayoutDashboard, Activity, UserCircle2, FileText, Scale } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { FaAccusoft } from 'react-icons/fa';
import { DocumentIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { label: 'Home', href: '/', icon: <Home size={18} /> },
        { label: 'About', href: '/about', icon: <User2 size={18} /> },
        { label: 'VIP Page', href: '/pricing', icon: <FaAccusoft size={18} /> },
        { label: 'Contact', href: '/contact', icon: <EnvelopeIcon className="w-[18px]" /> },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.href = "/"
            router.replace("/")


        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);

    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('user-dropdown');
            const button = document.getElementById('user-menu-button');
            if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleDropdown();
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-green-950 shadow-lg' : `${pathname === "/" ? '' : 'bg-green-950 '}`
            }`}>
            <div className="container mx-auto py-2 px-4">
                <div className="flex items-center justify-between h-10 md:h-12 lg:h-18 xl:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <img
                            src="/img.png"
                            alt="ChrisWrldArena Logo"
                            className="h-10 md:h-12 lg:h-18 xl:h-20 w-auto"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8 lg:space-x-2 xl:space-x-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isScrolled
                                    ? `text-black ${pathname === item.href ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`
                                    : `text-black ${pathname === item.href ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`
                                    } transition-colors duration-200`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        {pathname.includes("/predictions") && <div
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isScrolled
                                ? `text-black ${pathname.includes("/predictions") ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`
                                : `text-black ${pathname.includes("/predictions") ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`
                                } transition-colors duration-200`}
                        >
                            <Activity className="w-[18px]" />
                            <span>Predictions</span>
                        </div>}
                        {pathname.includes("/profile") && <div
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isScrolled
                                ? `text-black ${pathname.includes("/profile") ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`
                                : `text-black ${pathname.includes("/profile") ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`
                                } transition-colors duration-200`}
                        >
                            <UserCircle2 className="w-[18px]" />
                            <span>User Profile</span>
                        </div>}
                        {pathname.includes("/legal") && <div
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isScrolled
                                ? `text-black ${pathname.includes("/legal") ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`
                                : `text-black ${pathname.includes("/legal") ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`
                                } transition-colors duration-200`}
                        >
                            <Scale className="w-[18px]" />
                            <span>Legalities</span>
                        </div>}
                    </div>

                    {/* Auth Buttons/Profile */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : user ? (
                            <div className="relative text-sm">
                                <button
                                    id="user-menu-button"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-white/20 text-white hover:bg-white/20`}
                                    onClick={toggleDropdown}
                                    onKeyDown={handleKeyDown}
                                    aria-haspopup="true"
                                    aria-expanded={dropdownVisible}
                                    aria-controls="user-dropdown"
                                >
                                    <User size={20} />
                                    <span>{user.username || 'Account'}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transform transition-transform duration-200 ${dropdownVisible ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <div
                                    id="user-dropdown"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transition-all duration-200 transform origin-top-right ${dropdownVisible
                                        ? 'scale-100 opacity-100'
                                        : 'scale-95 opacity-0 pointer-events-none'
                                        }`}  >

                                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 transition-colors cursor-default">
                                        <UserCheck2 className='size-4' />
                                        Profile
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 transition-colors cursor-default">
                                            <LayoutDashboard className='size-4' />
                                            Dashboard
                                        </Link>
                                    )}
                                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 transition-colors cursor-default">
                                        <User2 className='size-4' />
                                        <p className=" text-neutral-700">  {user.username} </p>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 transition-colors cursor-default">
                                        <EnvelopeIcon className='size-4' />
                                        <p className=" text-neutral-700 truncate">  {user.email} </p>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 transition-colors cursor-default">
                                        <Home className='size-4' />
                                        <p className=" text-neutral-700">  {user.location?.country} ({user.location?.currencycode})</p>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Sign Out
                                    </button>

                                </div>
                            </div>




                        ) : (
                            <div className="flex items-center space-x-4 w-full">
                                <Link
                                    href="/signin"
                                    className={`px-8 py-2 rounded-full text-sm text-gray-700 bg-gray-200 hover:bg-gray-100`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-8 py-2 rounded-full text-sm bg-green-900 text-white hover:bg-green-600"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden rounded-md  text-white`}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="fixed top-0 right-0 left-0 inset-x-0 lg:hidden bg-green-950 shadow-xl p-8 -z-50">
                    <div className="px-2 pt-2 pb-3 space-y-4 mt-8 transition-transform duration-500">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex  items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${pathname === item.href
                                    ? 'text-black bg-yellow-500'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        {user && <div className="mx-1">
                            <Link href="/profile" className="flex items-center rounded-lg gap-2 p-2 text-white hover:text-white hover:bg-white/10 transition-colors cursor-default">
                                <UserCheck2 className='size-5' />
                                Profile
                            </Link>
                            {user.role === 'ADMIN' && (
                                <Link href="/dashboard" className="flex items-center rounded-lg gap-2 p-2 text-white hover:text-white hover:bg-white/10 transition-colors cursor-default">
                                    <LayoutDashboard className='size-5' />
                                    Dashboard
                                </Link>
                            )}
                            <hr className='w-full my-4 border border-green-700' />
                            <div className="flex items-center gap-2 p-2 text-white transition-colors cursor-default">
                                <User2 className='size-5' />
                                <p className=" text-white/80">  {user.username} </p>
                            </div>

                            <div className="flex items-center gap-2 p-2 text-white  transition-colors cursor-default">
                                <EnvelopeIcon className='size-5' />
                                <p className=" text-white/80 truncate">  {user.email} </p>
                            </div>

                            <div className="flex items-center gap-2 p-2  text-white transition-colors cursor-default">
                                <Home className='size-5' />
                                <p className=" text-white/80">  {user.location?.country} ({user.location?.currencycode})</p>
                            </div>
                            <hr className='w-full border my-4 border-green-700' />
                            <button
                                onClick={handleSignOut}
                                className="bloc text-left py-2 px-8 text-sm bg-red-100/90 w-max rounded-lg font-bold text-red-600 hover:bg-gray-100"
                            >
                                Sign Out
                            </button>
                        </div>}
                        {!user && (
                            <div className="flex gap-4 pt-4 items-center mb-8 mx-2">
                                <Link
                                    href="/signin"
                                    className="block px-8 py-2 rounded-md text-base font-medium text-white-700 bg-gray-200 hover:bg-gray-100"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="block px-8 py-2 rounded-md text-base font-medium bg-green-500 text-white hover:bg-green-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
