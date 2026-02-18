'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Plus, X, Package } from 'lucide-react'
import Image from 'next/image'

type Material = {
    id: string
    name: string
    image_url: string | null
    rarity: string
}

type MaterialSelectorProps = {
    selectedMaterials: { material_id: string; quantity: number }[]
    onChange: (materials: { material_id: string; quantity: number }[]) => void
}

export default function MaterialSelector({ selectedMaterials, onChange }: MaterialSelectorProps) {
    const supabase = createClient()
    const [materials, setMaterials] = useState<Material[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        fetchMaterials()
    }, [])

    const fetchMaterials = async () => {
        const { data } = await supabase
            .from('materials')
            .select('id, name, image_url, rarity')
            .order('name')

        if (data) setMaterials(data)
    }

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedMaterials.some(s => s.material_id === m.id)
    )

    const addMaterial = (material: Material) => {
        onChange([...selectedMaterials, { material_id: material.id, quantity: 1 }])
        setSearchQuery('')
        setIsSearching(false)
    }

    const removeMaterial = (materialId: string) => {
        onChange(selectedMaterials.filter(m => m.material_id !== materialId))
    }

    const updateQuantity = (materialId: string, quantity: number) => {
        if (quantity < 1) return
        onChange(selectedMaterials.map(m =>
            m.material_id === materialId ? { ...m, quantity } : m
        ))
    }

    const getMaterialDetails = (id: string) => materials.find(m => m.id === id)

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return 'text-orange-400 border-orange-500/50'
            case 'epic': return 'text-purple-400 border-purple-500/50'
            case 'rare': return 'text-blue-400 border-blue-500/50'
            default: return 'text-slate-400 border-white/10'
        }
    }

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-400 mb-1">
                Required Materials
            </label>

            {/* Selected Materials List */}
            <div className="space-y-2">
                {selectedMaterials.map((item) => {
                    const material = getMaterialDetails(item.material_id)
                    if (!material) return null

                    return (
                        <div key={item.material_id} className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-lg border border-white/5">
                            <div className={`w-10 h-10 rounded bg-slate-900 border ${getRarityColor(material.rarity)} flex items-center justify-center relative overflow-hidden`}>
                                {material.image_url ? (
                                    <Image src={material.image_url} alt={material.name} fill className="object-cover" />
                                ) : (
                                    <Package className="w-5 h-5 opacity-50" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm text-white">{material.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{material.rarity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.material_id, parseInt(e.target.value) || 1)}
                                    className="w-16 bg-slate-900 border border-white/10 rounded px-2 py-1 text-center text-sm font-bold focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={() => removeMaterial(item.material_id)}
                                    type="button"
                                    className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Add Material Search */}
            <div className="relative">
                {isSearching ? (
                    <div className="absolute inset-0 z-10 bg-slate-900 border border-blue-500 rounded-lg shadow-xl">
                        <div className="flex items-center px-3 py-2 border-b border-white/10">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search materials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                            />
                            <button onClick={() => setIsSearching(false)} type="button">
                                <X className="w-4 h-4 text-slate-400 hover:text-white" />
                            </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto py-1">
                            {filteredMaterials.length === 0 ? (
                                <p className="px-3 py-2 text-xs text-slate-500 text-center">No materials found.</p>
                            ) : (
                                filteredMaterials.map(material => (
                                    <button
                                        key={material.id}
                                        type="button"
                                        onClick={() => addMaterial(material)}
                                        className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                                    >
                                        <div className={`w-6 h-6 rounded border ${getRarityColor(material.rarity)} flex items-center justify-center bg-slate-950`}>
                                            {material.image_url && <Image src={material.image_url} alt={material.name} width={24} height={24} className="rounded-sm" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{material.name}</p>
                                        </div>
                                        <Plus className="w-3 h-3 text-slate-500" />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsSearching(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wide"
                    >
                        <Plus className="w-4 h-4" />
                        Add Ingredient
                    </button>
                )}
            </div>
        </div>
    )
}
