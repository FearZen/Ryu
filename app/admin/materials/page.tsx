'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminNav from "@/components/layout/admin-nav"
import { Plus, Search, Package, Trash2, Edit, X, Save, Loader2 } from 'lucide-react'
import Image from 'next/image'
import ImageUpload from '@/components/features/image-upload'

type Material = {
    id: string
    name: string
    description: string
    image_url: string | null
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export default function MaterialsPage() {
    const supabase = createClient()
    const [materials, setMaterials] = useState<Material[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Edit/Create State
    const [isEditing, setIsEditing] = useState(false)
    const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({})
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchMaterials()
    }, [])

    const fetchMaterials = async () => {
        setIsLoading(true)
        const { data } = await supabase
            .from('materials')
            .select('*')
            .order('name')

        if (data) setMaterials(data as Material[])
        setIsLoading(false)
    }

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (material?: Material) => {
        setCurrentMaterial(material || { rarity: 'common' })
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will remove this material from all recipes.')) return

        const { error } = await supabase.from('materials').delete().eq('id', id)
        if (!error) {
            setMaterials(prev => prev.filter(m => m.id !== id))
        } else {
            alert('Error deleting material')
        }
    }

    const handleSave = async () => {
        if (!currentMaterial.name) return alert('Name is required')
        setIsSaving(true)

        const materialData = {
            name: currentMaterial.name,
            description: currentMaterial.description,
            image_url: currentMaterial.image_url,
            rarity: currentMaterial.rarity || 'common'
        }

        if (currentMaterial.id) {
            // Update
            const { error } = await supabase
                .from('materials')
                .update(materialData)
                .eq('id', currentMaterial.id)

            if (!error) {
                setMaterials(prev => prev.map(m => m.id === currentMaterial.id ? { ...m, ...materialData } as Material : m))
                setIsEditing(false)
            } else {
                alert('Error updating material')
            }
        } else {
            // Create
            const { data, error } = await supabase
                .from('materials')
                .insert(materialData)
                .select()
                .single()

            if (!error && data) {
                setMaterials(prev => [...prev, data as Material].sort((a, b) => a.name.localeCompare(b.name)))
                setIsEditing(false)
            } else {
                alert('Error creating material')
            }
        }
        setIsSaving(false)
    }

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return 'text-orange-400 border-orange-500/50 bg-orange-500/10'
            case 'epic': return 'text-purple-400 border-purple-500/50 bg-purple-500/10'
            case 'rare': return 'text-blue-400 border-blue-500/50 bg-blue-500/10'
            default: return 'text-slate-400 border-white/10 bg-white/5'
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
                            Materials
                        </h1>
                        <p className="text-slate-400">
                            Manage raw materials and components for crafting.
                        </p>
                    </div>
                    <button
                        onClick={() => handleEdit()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg hover:shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add Material
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredMaterials.map(material => (
                            <div key={material.id} className="bg-slate-900/50 border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-lg border ${getRarityColor(material.rarity)} flex items-center justify-center relative overflow-hidden`}>
                                        {material.image_url ? (
                                            <Image src={material.image_url} alt={material.name} fill className="object-cover" />
                                        ) : (
                                            <Package className="w-6 h-6 opacity-50" />
                                        )}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(material)} className="p-2 hover:bg-white/10 rounded text-blue-400">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(material.id)} className="p-2 hover:bg-white/10 rounded text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-white mb-1">{material.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRarityColor(material.rarity)}`}>
                                        {material.rarity}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">{material.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {currentMaterial.id ? 'Edit Material' : 'New Material'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Icon</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-black border border-white/10 relative overflow-hidden flex items-center justify-center">
                                        {currentMaterial.image_url ? (
                                            <Image src={currentMaterial.image_url} alt="Icon" fill className="object-cover" />
                                        ) : (
                                            <Package className="w-8 h-8 text-slate-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <ImageUpload
                                            bucketName="crafting-images"
                                            onUpload={(url) => {
                                                const finalUrl = Array.isArray(url) ? url[0] : url
                                                setCurrentMaterial(prev => ({ ...prev, image_url: finalUrl || null }))
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={currentMaterial.name || ''}
                                    onChange={(e) => setCurrentMaterial(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Rarity</label>
                                <select
                                    value={currentMaterial.rarity || 'common'}
                                    onChange={(e) => setCurrentMaterial(prev => ({ ...prev, rarity: e.target.value as any }))}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="common">Common</option>
                                    <option value="rare">Rare</option>
                                    <option value="epic">Epic</option>
                                    <option value="legendary">Legendary</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Description</label>
                                <textarea
                                    value={currentMaterial.description || ''}
                                    onChange={(e) => setCurrentMaterial(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Material
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
