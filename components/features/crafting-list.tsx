'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { CraftingItem } from '@/types'
import CraftingCard from './crafting-card'

type Props = {
    initialItems: CraftingItem[]
}

const CATEGORIES = ["All", "Weapon", "Drug", "Consumable", "Material"]

export default function CraftingList({ initialItems }: Props) {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')

    const filteredItems = initialItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = category === 'All' || item.category.toLowerCase() === category.toLowerCase()
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search blueprints..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${category === cat
                                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredItems.length > 0 ? (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredItems.map(item => (
                        <CraftingCard key={item.id} item={item} />
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">No blueprints found.</p>
                </div>
            )}
        </div>
    )
}
