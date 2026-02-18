'use client'

import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/features/image-upload"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/layout/admin-nav"

export default function NewTreasuryItemPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            image_urls: imageUrls, // Use new array column
            // image_url: imageUrls[0] || null // Optional: keep for legacy if needed
        }

        const { error: insertError } = await supabase
            .from('treasury_items')
            .insert(data)

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
        } else {
            router.push('/admin/treasury')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/treasury" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black">Register New Item</h1>
                        <p className="text-slate-400">Add a new item definition to the treasury catalog.</p>
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
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500"
                            placeholder="e.g. Python Pistol"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Category</label>
                        <select
                            name="category"
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
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500"
                            placeholder="Brief description..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Images</label>
                        <div className="border border-white/10 rounded-xl overflow-hidden bg-black/50 p-4">
                            <ImageUpload
                                multiple={true}
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
                        className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Registering...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Register Item
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
