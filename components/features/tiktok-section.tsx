'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function TikTokSection() {
    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-20 relative z-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-3xl overflow-hidden border border-blue-500/30 group shadow-[0_0_40px_rgba(37,99,235,0.15)]"
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black animate-gradient-xy">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.2),transparent_50%)]" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold text-white tracking-wider">LIVE UPDATES</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-lg">
                            FOLLOW THE DRAGON
                        </h2>

                        <p className="text-lg text-slate-300 leading-relaxed font-light">
                            Catch the latest highlights, wars, and daily chaos of the Ryu Sixnine family on our official TikTok.
                        </p>
                    </div>

                    <Link
                        href="https://www.tiktok.com/@bluuedragon"
                        target="_blank"
                        className="relative group/btn"
                    >
                        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover/btn:opacity-40 transition-opacity" />
                        <div className="relative px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 hover:border-blue-500/50 transition-all">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Official TikTok</span>
                                <span className="text-xl font-bold text-white">@bluuedragon</span>
                            </div>
                            <ExternalLink className="w-6 h-6 text-blue-400 group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </motion.div>
        </section>
    )
}
