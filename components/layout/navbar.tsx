'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { Map, Hammer, Image as ImageIcon, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Gallery', href: '/gallery', icon: ImageIcon },
]

export default function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Hide navbar on all admin pages AND member pages
    const isExcluded = pathname?.startsWith('/admin') ||
        pathname?.startsWith('/crafting') ||
        pathname?.startsWith('/treasury') ||
        pathname?.startsWith('/hierarchy') ||
        pathname === '/login' ||
        pathname === '/dashboard'

    if (isExcluded) return null

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 relative overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                            <img src="/ryu.gif" alt="Ryu Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                            RYU
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-baseline space-x-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            'px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2',
                                            isActive
                                                ? 'text-cyan-400 bg-blue-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        )}
                                    >
                                        <item.icon size={16} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Login Button */}
                        <Link
                            href="/login"
                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25"
                        >
                            MEMBER ACCESS
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-400 hover:text-white"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-black/90 border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={18} />
                                        {item.name}
                                    </div>
                                </Link>
                            ))}

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <Link
                                    href="/login"
                                    className="block w-full text-center px-5 py-3 rounded-lg bg-blue-600 text-white font-bold"
                                >
                                    MEMBER LOGIN
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
