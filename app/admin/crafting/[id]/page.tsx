'use client'

import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/features/image-upload"
import MaterialSelector from "@/components/features/material-selector"
import AdminNav from "@/components/layout/admin-nav"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Trash2, Package } from "lucide-react"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { CraftingItem } from "@/types"
import { deleteCraftingItem, updateCraftingItem } from "@/lib/actions/crafting"

export default function EditCraftingItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [item, setItem] = useState<CraftingItem | null>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()
    const [imageUrl, setImageUrl] = useState<string>('')
    const [ingredients, setIngredients] = useState<{ material_id: string; quantity: number }[]>([])

    useEffect(() => {
        const fetchItem = async () => {
            // Fetch Item
            const { data: itemData, error: itemError } = await supabase
                .from('crafting_items')
                .select('*')
                .eq('id', id)
                .single()

            if (itemError) {
                setError(itemError.message)
                setFetching(false)
                return
            }

            setItem(itemData)
            setImageUrl(itemData.image_url || '')

            // Fetch Ingredients
            const { data: ingData } = await supabase
                .from('recipe_ingredients')
                .select('material_id, quantity')
                .eq('recipe_id', id)

            if (ingData) {
                setIngredients(ingData)
            }

            setFetching(false)
        }
        fetchItem()
    }, [id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        if (imageUrl) formData.set('image_url', imageUrl)
        formData.set('ingredients', JSON.stringify(ingredients))

        try {
            // @ts-ignore
            const result = await updateCraftingItem(id, formData)
            if (result && 'error' in result && result.error) {
                setError(result.error)
                setLoading(false)
            }
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this blueprint?')) return

        setLoading(true)
        await deleteCraftingItem(id)
        router.push('/admin/crafting')
    }

    if (fetching) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>
    if (!item) return <div className="min-h-screen bg-black text-white p-8">Item not found</div>

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-4xl mx-auto px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/crafting" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black">Edit Blueprint</h1>
                            <p className="text-slate-400">Update crafting recipe and details.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20 font-bold"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Item
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Image */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400">Blueprint Image</label>
                            <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900">
                                <ImageUpload
                                    bucketName="crafting-images"
                                    initialImage={imageUrl}
                                    onUpload={(url) => setImageUrl(url as string)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Data */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400">Blueprint Name</label>
                            <input
                                name="name"
                                defaultValue={item.name}
                                type="text"
                                required
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-400">Category</label>
                                <select
                                    name="category"
                                    defaultValue={item.category}
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
                                <label className="block text-sm font-medium text-slate-400">Base Price</label>
                                <input
                                    name="base_price"
                                    defaultValue={item.base_price || 0}
                                    type="number"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400">Description</label>
                            <textarea
                                name="description"
                                defaultValue={item.description || ''}
                                rows={3}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
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
                                        Save Changes
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
