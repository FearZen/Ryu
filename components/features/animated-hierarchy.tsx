'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Shield, ShieldAlert, Skull, Sword, Wallet, User, Users, X, Info, Zap } from 'lucide-react'
import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

// Portal Component
function ModalPortal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    // Ensure document is available
    if (typeof document === 'undefined') return null

    return createPortal(children, document.body)
}

// Use Roster Type
type RosterMember = {
    id: string
    name: string
    ranks: string[] // Array of ranks
    avatar_url: string | null
    bio: string | null
    status: string
}

type HierarchyProps = {
    initialRoster?: RosterMember[]
}

const rankConfig: Record<string, { title: string, icon: any, color: string, order: number }> = {
    'Boss': { title: "BOSS", icon: Crown, color: "text-amber-500", order: 1 },
    'OG': { title: "OG", icon: Shield, color: "text-red-500", order: 2 },
    'Vice': { title: "VICE", icon: ShieldAlert, color: "text-orange-500", order: 3 },
    'SDM': { title: "SDM", icon: Users, color: "text-blue-500", order: 4 },
    'Punisher': { title: "PUNISHER", icon: Sword, color: "text-purple-500", order: 5 },
    'Brangkas': { title: "BRANGKAS", icon: Wallet, color: "text-green-500", order: 6 },
    'RC': { title: "RC (ROAD CAPTAIN)", icon: Skull, color: "text-pink-500", order: 7 },
}

export default function AnimatedHierarchy({ initialRoster = [] }: HierarchyProps) {
    const [roster, setRoster] = useState<RosterMember[]>(initialRoster)
    const [selectedMember, setSelectedMember] = useState<RosterMember | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchRoster = async () => {
            const { data } = await supabase.from('roster').select('*').order('created_at', { ascending: true })
            if (data) setRoster(data)
        }
        fetchRoster()
    }, [])

    // Group profiles by rank
    // Note: A member can appear in multiple ranks
    const hierarchy = Object.entries(rankConfig)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([rankKey, config]) => ({
            ...config,
            members: roster.filter(p => p.ranks && p.ranks.includes(rankKey))
        }))
        .filter(group => group.members.length > 0)


    useEffect(() => {
        if (selectedMember) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [selectedMember])

    return (
        <div className="w-full max-w-7xl mx-auto py-16 px-4 relative z-20">

            {/* Header */}
            <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-tight">
                    Structure
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
            </div>

            <div className="space-y-16">
                {hierarchy.map((rank, index) => (
                    <motion.div
                        key={rank.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex flex-col items-center"
                    >
                        {/* Rank Header */}
                        <div className="flex items-center gap-3 mb-8 bg-slate-900/50 px-6 py-2 rounded-full border border-white/5">
                            <rank.icon className={clsx("w-5 h-5", rank.color)} />
                            <h3 className={clsx("text-lg font-bold tracking-widest", rank.color)}>
                                {rank.title}
                            </h3>
                        </div>

                        {/* Members Grid */}
                        <div className="flex flex-wrap justify-center gap-6 w-full">
                            {rank.members.map((member) => (
                                <motion.div
                                    key={member.id + rank.title}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative group cursor-pointer"
                                    onClick={() => setSelectedMember(member)}
                                >
                                    <div className="w-48 bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-4 hover:border-blue-500/50 transition-colors shadow-lg">

                                        {/* Avatar */}
                                        <div className="w-20 h-20 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700 group-hover:border-blue-500 transition-colors">
                                            {member.avatar_url ? (
                                                <Image src={member.avatar_url} alt={member.name} width={80} height={80} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <User className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center">
                                            <h4 className="font-bold text-white text-lg leading-tight mb-1">
                                                {member.name}
                                            </h4>
                                            <span className={clsx("text-xs font-bold uppercase", rank.color)}>
                                                {rank.title}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <ModalPortal>
                        <motion.div
                            layoutId={selectedMember.id}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
                        >
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedMember(null)}
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            />

                            {/* Modal Content */}
                            <motion.div
                                className="relative bg-[#0f172a] w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 z-[10000]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                                {/* Close Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedMember(null)
                                    }}
                                    className="absolute top-4 right-4 z-[10010] p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors border border-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Image Section - Floating Style */}
                                <div className="md:w-1/2 relative h-64 md:h-full bg-gradient-to-b from-slate-800 to-slate-900 flex items-end justify-center overflow-hidden">
                                    {/* Decorative elements behind image */}
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

                                    <motion.div
                                        className="relative w-full h-full"
                                        initial={{ scale: 1.1, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Image
                                            src={selectedMember.avatar_url || '/placeholder-user.jpg'}
                                            alt={selectedMember.name || 'Member'}
                                            fill
                                            className="object-contain object-bottom drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                            priority
                                        />
                                    </motion.div>
                                </div>

                                {/* Content Section */}
                                <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-slate-950/50 flex flex-col">
                                    <div className="mb-8">
                                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 uppercase">
                                            {selectedMember.name}
                                        </h2>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {/* Rank Badges from 'ranks' array - Case Insensitive Logic */}
                                            {selectedMember.ranks && selectedMember.ranks.map((r: string) => {
                                                // Case-insensitive lookup
                                                const normalizedRank = Object.keys(rankConfig).find(key => key.toLowerCase() === r.toLowerCase()) || r
                                                const rankInfo = rankConfig[normalizedRank]

                                                // Fallback color logic if rank not found in config
                                                const defaultColor = "text-slate-300 border-white/10 bg-white/5"
                                                const activeColor = rankInfo?.color
                                                    ? rankInfo.color.replace('text-', 'border-').replace('400', '500/20').replace('500', '500/20') + ' ' + rankInfo.color.replace('text-', 'bg-').replace('400', '500/10').replace('500', '500/10') + ' ' + rankInfo.color
                                                    : defaultColor

                                                return (
                                                    <span
                                                        key={r}
                                                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 border ${activeColor}`}
                                                    >
                                                        {rankInfo && <rankInfo.icon className="w-3 h-3" />}
                                                        {r}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Biography */}
                                    {selectedMember.bio && (
                                        <div className="prose prose-invert max-w-none mb-8">
                                            <h4 className="text-sm font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-wider">
                                                <Info className="w-4 h-4" /> Biography
                                            </h4>
                                            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                                                {selectedMember.bio}
                                            </p>
                                        </div>
                                    )}

                                    {/* Status Section - Pushed to bottom */}
                                    {selectedMember.status && (
                                        <div className="mt-auto pt-6 border-t border-white/10">
                                            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                                <div className="p-3 bg-green-500/10 rounded-lg">
                                                    <Zap className="w-6 h-6 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Status</p>
                                                    <p className="text-xl font-bold text-white">{selectedMember.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </ModalPortal>
                )}
            </AnimatePresence>
        </div>
    )
}
