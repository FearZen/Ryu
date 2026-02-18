'use client'

import { Material } from "@/types"
import { ChevronDown, MapPin, Hammer, Briefcase, Info } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface IngredientCardProps {
    material: Material
    targetQuantity: number
}

export default function IngredientCard({ material, targetQuantity }: IngredientCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const requiredCount = material.quantity_per_item * targetQuantity

    // Helper to calculate raw materials for sub-recipes (e.g. Marju)
    const getSubIngredients = () => {
        if (!material.acquisition_data?.sub_ingredients || !material.acquisition_data.yield) return null

        const yieldPerCraft = material.acquisition_data.yield
        const craftsNeeded = Math.ceil(requiredCount / yieldPerCraft)

        return material.acquisition_data.sub_ingredients.map(sub => ({
            ...sub,
            total: sub.count * craftsNeeded
        }))
    }

    const subIngredients = getSubIngredients()

    return (
        <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-sm hover:border-white/20 transition-all">
            {/* Header / Summary */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/50 transition-colors text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center border border-white/5">
                        {/* Placeholder Icon if no image */}
                        <Info className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{material.name}</h3>
                        <div className="text-slate-400 text-sm flex items-center gap-2">
                            Required: <span className="text-blue-400 font-mono font-bold">{requiredCount.toLocaleString()}</span>
                            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                                {material.acquisition_data?.method || 'Direct'}
                            </span>
                        </div>
                    </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {/* Details Accordion */}
            <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden bg-black/20">
                    <div className="p-4 space-y-4 border-t border-white/5 text-sm">

                        {/* 1. Quick Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {material.acquisition_data?.job_name && (
                                <div className="flex items-start gap-3 p-3 rounded bg-blue-900/10 border border-blue-500/10">
                                    <Briefcase className="w-4 h-4 text-blue-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-blue-300/70 uppercase font-bold mb-1">Job Required</div>
                                        <div className="text-blue-100 font-medium">{material.acquisition_data.job_name}</div>
                                    </div>
                                </div>
                            )}

                            {material.acquisition_data?.location_name && (
                                <div className="flex items-start gap-3 p-3 rounded bg-emerald-900/10 border border-emerald-500/10">
                                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-emerald-300/70 uppercase font-bold mb-1">Location</div>
                                        <div className="text-emerald-100 font-medium">{material.acquisition_data.location_name}</div>
                                    </div>
                                </div>
                            )}

                            {material.acquisition_data?.tools && material.acquisition_data.tools.length > 0 && (
                                <div className="flex items-start gap-3 p-3 rounded bg-amber-900/10 border border-amber-500/10 col-span-full">
                                    <Hammer className="w-4 h-4 text-amber-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-amber-300/70 uppercase font-bold mb-1">Tools Needed</div>
                                        <div className="flex flex-wrap gap-2">
                                            {material.acquisition_data.tools.map((tool, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-amber-500/10 text-amber-200 rounded text-xs border border-amber-500/20">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Sub-Recipe Calculator (e.g. Marju) */}
                        {subIngredients && (
                            <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                                <h4 className="font-bold text-slate-300 mb-3 text-xs uppercase tracking-wider">Raw Material Breakdown</h4>
                                <div className="space-y-2">
                                    {subIngredients.map((sub, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">{sub.name}</span>
                                            <span className="font-mono text-white">{sub.total.toLocaleString()} <span className="text-slate-600 text-xs">({sub.count} x {Math.ceil(requiredCount / (material.acquisition_data?.yield || 1))} crafts)</span></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Step-by-Step Guide */}
                        {material.acquisition_data?.steps && (
                            <div className="space-y-2">
                                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">Acquisition Steps</h4>
                                <div className="space-y-3 relative pl-2">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
                                    {material.acquisition_data.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 relative">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0 z-10 text-[10px] font-bold text-slate-400">
                                                {idx + 1}
                                            </div>
                                            <p className="text-slate-400 pt-0.5 leading-relaxed">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fallback for old 'tutorial' field */}
                        {!material.acquisition_data && material.tutorial && (
                            <div className="p-4 bg-slate-800 rounded text-slate-400 italic">
                                "{material.tutorial}"
                            </div>
                        )}

                        {/* Simple fallback if no data */}
                        {!material.acquisition_data && !material.tutorial && (
                            <div className="text-slate-500 text-xs text-center py-4">
                                No acquisition data available.
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
