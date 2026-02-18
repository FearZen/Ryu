'use client'

import { createCraftingItem } from "@/lib/actions/crafting"
import ImageUpload from "@/components/features/image-upload"
import MaterialSelector from "@/components/features/material-selector"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Package } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/layout/admin-nav"

export default function NewCraftingItemPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string>('')
    const [ingredients, setIngredients] = useState<{ material_id: string; quantity: number }[]>([])
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        // Append extra data
        if (imageUrl) formData.set('image_url', imageUrl)
        if (ingredients.length > 0) formData.set('ingredients', JSON.stringify(ingredients))

        try {
            // @ts-ignore
            const result = await createCraftingItem(formData)

            if (result && 'error' in result && result.error) {
                setError(result.error)
                setLoading(false)
            }
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-4xl mx-auto px-8 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/crafting" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black">New Blueprint</h1>
                        <p className="text-slate-400">Add a new item to the crafting system.</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Image & Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400">Blueprint Image</label>
                            <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900">
                                <ImageUpload
                                    bucketName="crafting-images"
                                    onUpload={(url) => setImageUrl(url as string)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Ingredients */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400">Blueprint Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                placeholder="e.g. Assault Rifle MK2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-400">Category</label>
                                <select
                                    name="category"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Weapon">Weapon</option>
                                    <option value="Drug">Drug</option>
                                    <option value="Consumable">Consumable</option>
                                    <option value="Material">Material</option>
                                    <option value="Ammo">Ammo</option>
                                    <option value="Armor">Armor</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-400">Base Price (Est.)</label>
                                <input
                                    name="base_price"
                                    type="number"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                placeholder="Item details..."
                            />
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-500" />
                                    Recipe Requirements
                                </h3>
                                <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
                                    <MaterialSelector
                                        selectedMaterials={ingredients}
                                        onChange={setIngredients}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Create Blueprint
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
