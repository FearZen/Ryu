'use client'

import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/features/image-upload"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/layout/admin-nav"
import { TreasuryItem } from "@/types"

export default function EditTreasuryItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [item, setItem] = useState<TreasuryItem | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchItem = async () => {
            const { data, error } = await supabase.from('treasury_items').select('*').eq('id', id).single()
            if (error) {
                setError("Failed to load item")
            } else {
                setItem(data)
                // Handle image migration mapping
                const images = data.image_urls || (data.image_url ? [data.image_url] : [])
                setImageUrls(images)
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
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            image_urls: imageUrls,
            // image_url: imageUrls[0] || null // Maintain backward compat if needed
        }

        const { error: updateError } = await supabase
            .from('treasury_items')
            .update(data)
            .eq('id', id)

        if (updateError) {
            setError(updateError.message)
            setLoading(false)
        } else {
            router.push('/admin/treasury')
            router.refresh()
        }
    }

    if (fetching) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>

    if (!item) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">Item not found</div>

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/treasury" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black">Edit Item</h1>
                        <p className="text-slate-400">Update item details.</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/10 p-6 rounded-2xl space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Item Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={item.name}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Category</label>
                        <select
                            name="category"
                            defaultValue={item.category}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500"
                        >
                            <option value="weapon">Weapon</option>
                            <option value="cash">Cash / Money</option>
                            <option value="drug">Drug / Narcotic</option>
                            <option value="material">Material / Component</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={item.description || ''}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Images</label>
                        <div className="border border-white/10 rounded-xl overflow-hidden bg-black/50 p-4">
                            <ImageUpload
                                multiple={true}
                                defaultValue={imageUrls}
                                onUpload={(urls) => {
                                    if (Array.isArray(urls)) setImageUrls(urls)
                                    else if (urls) setImageUrls([urls])
                                    else setImageUrls([])
                                }}
                            />
                        </div>
                    </div>

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
                </form>
            </div>
        </div>
    )
}
