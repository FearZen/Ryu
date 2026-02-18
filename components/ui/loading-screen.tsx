'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading or check session
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2500) // 2.5s splash screen

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-blue-950 opacity-80" />

                    {/* Logo Container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Logo Text/Image (Replace with Image if available) */}
                        <div className="w-32 h-32 mb-6 relative">
                            <img
                                src="/ryunaga3.png"
                                alt="Ryu Logo"
                                className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] animate-pulse"
                            />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            RYU SIXNINE
                        </h1>

                        <p className="mt-4 text-sm font-medium tracking-[0.3em] text-blue-200 uppercase opacity-80">
                            Faction Portal
                        </p>

                        {/* Loading Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 200 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="h-1 mt-8 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
