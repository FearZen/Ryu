'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Hammer, Map, Image as ImageIcon, ArrowLeft, LogOut, Menu, X, Wallet, Users, Shield, Layers, Box } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Roster', href: '/admin/roster', icon: Users }, // Renamed from Users
    { name: 'Crafting', href: '/admin/crafting', icon: Hammer },
    { name: 'Materials', href: '/admin/materials', icon: Box },
    { name: 'Map', href: '/admin/map', icon: Map },
    { name: 'Treasury', href: '/admin/treasury', icon: Wallet },
    { name: 'Stories', href: '/admin/stories', icon: Layers }, // Added Stories
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
]

export default function AdminNav() {
    const router = useRouter()
    const supabase = createClient()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <nav className="bg-slate-900 border-b border-white/10 mb-8 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left: Brand */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-white font-black tracking-tighter text-xl flex items-center gap-2">
                            <span className="text-blue-500">RYU</span> ADMIN
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            <div className="h-6 w-px bg-white/10 mx-4" />
                            {adminLinks.map(link => {
                                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                                            isActive
                                                ? "bg-blue-600/20 text-blue-400"
                                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right: Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors font-bold"
                        >
                            <LogOut className="w-4 h-4" />
                            LOGOUT
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-400 hover:text-white"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-slate-900 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {adminLinks.map(link => {
                                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "block px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3",
                                            isActive
                                                ? "bg-blue-600/20 text-blue-400"
                                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        {link.name}
                                    </Link>
                                )
                            })}
                            <div className="border-t border-white/10 my-2 pt-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-3 transition-colors text-left"
                                >
                                    <LogOut className="w-5 h-5" />
                                    LOGOUT
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
