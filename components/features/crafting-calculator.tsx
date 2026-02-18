'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, DollarSign, Package } from 'lucide-react'
import { CraftingItem, Material } from '@/types'
import IngredientCard from './crafting/ingredient-card'

type Props = {
    item: CraftingItem
    materials: Material[]
}

export default function CraftingCalculator({ item, materials }: Props) {
    const [quantity, setQuantity] = useState(1)
    const [sellPrice, setSellPrice] = useState(item.base_price || 0)

    // Calculate totals
    const totalRevenue = sellPrice * quantity
    // Assuming base_price is cost, profit = revenue - (cost * quantity)
    // If base_price is not cost, just show revenue.
    // The prompt implies "base_price" might be a reference.
    // Let's just show Estimated Revenue for now as requested "Total estimasi pendapatan".

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Calculator Inputs */}
            <div className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-blue-400" />
                        Production Planner
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                Quantity to Craft
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                Sell Price (per item)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="number"
                                    min="0"
                                    value={sellPrice}
                                    onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-green-400 focus:outline-none focus:border-green-500 transition-all font-mono text-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profit Estimator Card */}
                <motion.div
                    layout
                    className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20"
                >
                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2">
                        Total Estimated Revenue
                    </h3>
                    <div className="text-4xl font-black text-white font-mono">
                        ${totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500/60 mt-1">
                        Based on {quantity} units x ${sellPrice.toLocaleString()}
                    </p>
                </motion.div>
            </div>

            {/* Right: Material Requirements */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm h-fit">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    Required Materials
                </h3>

                <div className="space-y-4">
                    {materials.map((mat) => (
                        <IngredientCard
                            key={mat.id}
                            material={mat}
                            targetQuantity={quantity}
                        />
                    ))}

                    {materials.length === 0 && (
                        <p className="text-slate-500 text-center py-4">
                            No materials listed for this blueprint.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
