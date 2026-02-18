'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Hammer, Wallet, Crown, LogOut, Shield, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(true)
    const [isMember, setIsMember] = useState(false)

    useEffect(() => {
        const checkAccess = async () => {
            // 1. Check for Admin Login
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                router.push('/admin/dashboard')
                return
            }

            // 2. Check for Member Access Token
            const hasAccess = localStorage.getItem('ryu_access_granted')
            if (hasAccess === 'true') {
                setIsMember(true)
                setIsLoading(false)
            } else {
                router.push('/login')
            }
        }
        checkAccess()
    }, [router, supabase])

    const handleLogout = () => {
        localStorage.removeItem('ryu_access_granted')
        document.cookie = "ryu_member_access=; path=/; max-age=0"
        router.push('/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-blue-500 font-mono animate-pulse">VERIFYING CLEARANCE...</p>
                </div>
            </div>
        )
    }

    const menuItems = [
        {
            title: 'CRAFTING',
            description: 'Access blueprints and recipes.',
            icon: Hammer,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            hover: 'group-hover:border-blue-500',
            href: '/crafting'
        },
        {
            title: 'TREASURY',
            description: 'View faction funds and items.',
            icon: Wallet,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            hover: 'group-hover:border-green-500',
            href: '/treasury'
        },
        {
            title: 'HIERARCHY',
            description: 'View command structure.',
            icon: Crown,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            hover: 'group-hover:border-amber-500',
            href: '/hierarchy'
        }
    ]

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 p-96 bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20"
                >
                    <div className="flex items-center gap-6">
                        <Link href="/" className="relative w-24 h-24 hover:scale-105 transition-transform cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse" />
                            <div className="relative w-full h-full rounded-full border-2 border-white/10 bg-slate-900 overflow-hidden flex items-center justify-center p-4">
                                <img src="/ryu.gif" alt="RYU" className="w-full h-full object-contain" />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-slate-900 border border-white/10 p-1.5 rounded-full">
                                <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                            </div>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black tracking-tighter uppercase">MEMBER ACCESS</h1>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    VERIFIED
                                </span>
                            </div>
                            <p className="text-blue-400 font-mono text-sm tracking-wider uppercase mb-2">
                                Operating on Secure Frequency
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-red-400 font-bold text-sm uppercase tracking-wider"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Disconnect
                    </button>
                </motion.div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {menuItems.map((item, i) => (
                        <Link href={item.href} key={item.title}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`group h-full p-8 rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 relative overflow-hidden ${item.border} ${item.hover}`}
                            >
                                {/* Hover Gradient */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-white via-transparent to-transparent`} />

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${item.bg} ${item.color}`}>
                                    <item.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-black tracking-tight mb-2 flex items-center gap-2">
                                    {item.title}
                                    <ChevronRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all ${item.color}`} />
                                </h3>
                                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    {item.description}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Status Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 border-t border-white/5 pt-8 flex items-center justify-between text-xs font-mono text-slate-600 uppercase tracking-widest"
                >
                    <span>System Status: <span className="text-green-500">Online</span></span>
                    <span>Secure Connection</span>
                    <span>v2.1.0</span>
                </motion.div>
            </div>
        </div>
    )
}
