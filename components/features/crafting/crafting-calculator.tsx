'use client'

import { CraftingItem, Material } from "@/types"
import { useState } from "react"
import IngredientCard from "./ingredient-card"

interface CraftingCalculatorProps {
    item: CraftingItem
    materials: Material[]
}

export default function CraftingCalculator({ item, materials }: CraftingCalculatorProps) {
    const [quantity, setQuantity] = useState(1)

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value)
        if (!isNaN(val) && val > 0) {
            setQuantity(val)
        } else if (e.target.value === '') {
            setQuantity(1) // Visual fallback, though inputs are tricky
        }
    }

    return (
        <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start">

            {/* Left: Controls & Summary */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Production Plan</h2>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400 font-medium">Target Quantity</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <div className="px-4 py-3 bg-slate-800 rounded-xl text-slate-400 font-bold">
                                UNITS
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="space-y-2">
                        <div className="flex justify-between text-slate-400">
                            <span>Base Unit Price</span>
                            <span>${item.base_price?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-green-400">
                            <span>Est. Total Value</span>
                            <span>${((item.base_price || 0) * quantity).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Ingredients Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Required Materials</h2>
                    <span className="text-slate-500 text-sm">Based on {quantity} units</span>
                </div>

                <div className="grid gap-4">
                    {materials.map((mat) => (
                        <IngredientCard
                            key={mat.id}
                            material={mat}
                            targetQuantity={quantity}
                        />
                    ))}

                    {materials.length === 0 && (
                        <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-slate-500">
                            No materials recorded for this blueprint.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
