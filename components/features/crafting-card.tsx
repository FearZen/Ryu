'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Hammer, ArrowRight, Scan, Banknote } from 'lucide-react'
import { CraftingItem } from '@/types'

export default function CraftingCard({ item }: { item: CraftingItem }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        >
            {/* Tech Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/10 rounded-tl-2xl z-20 group-hover:border-blue-500/50 transition-colors" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-2xl z-20 group-hover:border-blue-500/50 transition-colors" />

            {/* Image Placeholder or Real Image */}
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-800 relative">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                        <Hammer className="w-16 h-16 opacity-20" />
                    </div>
                )}

                {/* Scanline Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_3px] pointer-events-none opacity-20" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-sm border-l-2 border-cyan-400 text-[10px] font-bold text-cyan-400 uppercase tracking-widest shadow-lg">
                    {item.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate tracking-tight">
                    {item.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2 min-h-[40px] font-light leading-relaxed">
                    {item.description || "No tactical description available."}
                </p>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Estimated Cost</span>
                        <div className="flex items-center gap-1.5 text-emerald-400">
                            <Banknote className="w-4 h-4" />
                            <span className="font-mono text-sm font-bold tracking-tight">
                                ${item.base_price?.toLocaleString() || 'N/A'}
                            </span>
                        </div>
                    </div>

                    <Link
                        href={`/crafting/${item.id}`}
                        className="relative overflow-hidden pl-4 pr-10 py-2 rounded-lg bg-white/5 text-white hover:bg-blue-600 transition-all group/btn"
                    >
                        <span className="relative z-10 text-xs font-bold uppercase tracking-wider">Acquire</span>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                            <ArrowRight className="w-4 h-4 group-hover/btn:-rotate-45 transition-transform duration-300" />
                        </div>
                        {/* Glitch Overlay on Hover */}
                        <div className="absolute inset-0 bg-blue-400/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 blur-md" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
