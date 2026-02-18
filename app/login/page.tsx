'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock, Mail, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [loginMode, setLoginMode] = useState<'admin' | 'member'>('member') // Default to member for general public
    const [isLogin, setIsLogin] = useState(true) // For Admin: Login vs Signup
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showAccessCode, setShowAccessCode] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const ACCESS_CODE = 'RYU-MEMBER-2026'

    const handleMemberLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const code = formData.get('accessCode') as string

        if (code === ACCESS_CODE) {
            localStorage.setItem('ryu_access_granted', 'true')
            // Set cookie for middleware if needed, but for now client-side check is primary
            document.cookie = "ryu_member_access=true; path=/; max-age=86400"
            setLoading(false) // Reset loading before redirect to prevent spinning
            router.push('/dashboard')
        } else {
            setError('Invalid Access Code. Verification failed.')
            setLoading(false)
        }
    }

    const handleAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const username = formData.get('username') as string

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/admin/dashboard')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: username,
                        },
                    },
                })
                if (error) throw error
                router.push('/admin/dashboard')
            }
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 p-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Back Button */}
            <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
                    <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span className="text-sm font-mono uppercase tracking-widest">Return Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block mb-4 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20"
                        >
                            <img src="/ryu.gif" alt="RYU" className="w-12 h-12 object-contain" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
                            {loginMode === 'member' ? 'MEMBER ACCESS' : (isLogin ? 'ADMIN LOGIN' : 'ADMIN SIGNUP')}
                        </h1>
                        <p className="text-slate-400">
                            {loginMode === 'member'
                                ? 'Enter access code to view faction data.'
                                : 'Restricted area for authorized officers.'}
                        </p>
                    </div>

                    {/* Toggle Mode */}
                    <div className="flex p-1 bg-black/40 rounded-xl mb-8 border border-white/5">
                        <button
                            onClick={() => { setLoginMode('member'); setError(null) }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMode === 'member'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            MEMBER
                        </button>
                        <button
                            onClick={() => { setLoginMode('admin'); setError(null) }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMode === 'admin'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            ADMIN
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center font-bold"
                        >
                            {error}
                        </motion.div>
                    )}

                    {loginMode === 'member' ? (
                        /* Member Access Form */
                        <form onSubmit={handleMemberLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Access Code</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        name="accessCode"
                                        type={showAccessCode ? "text" : "password"}
                                        required
                                        placeholder="Enter code..."
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowAccessCode(!showAccessCode)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showAccessCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group mt-6"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
                            </button>
                        </form>
                    ) : (
                        /* Admin Login Form */
                        <form onSubmit={handleAdminSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            placeholder="Agent Name"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="admin@ryu.com"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group mt-6"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Login to Admin' : 'Register Admin'}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin)
                                        setError(null)
                                    }}
                                    className="text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    {isLogin ? (
                                        <>Need an account? <span className="text-blue-400 font-bold">Sign up</span></>
                                    ) : (
                                        <>Have an account? <span className="text-blue-400 font-bold">Login</span></>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
