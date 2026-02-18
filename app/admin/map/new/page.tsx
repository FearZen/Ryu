'use client'

import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/features/image-upload"
import LocationPickerWrapper from "@/components/features/map/location-picker-wrapper"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/layout/admin-nav"

export default function NewMapLocationPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [coords, setCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [imageUrl, setImageUrl] = useState<string | null>(null)
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
            type: formData.get('type') as string,
            x_position: Number(formData.get('x_position')),
            y_position: Number(formData.get('y_position')),
            image_url: imageUrl || null
        }

        const { error: insertError } = await supabase
            .from('map_locations')
            .insert(data)

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
        } else {
            router.push('/admin/map')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/map" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black">New Map Location</h1>
                        <p className="text-slate-400">Add a new point of interest to the map.</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Form */}
                    <form id="location-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-400">Location Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. Central Mining Hub"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-400">Type</label>
                                <select
                                    name="type"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="general">General</option>
                                    <option value="base">Faction Base</option>
                                    <option value="gathering">Resource / Gathering</option>
                                    <option value="storage">Storage / Safehouse</option>
                                    <option value="work">Workplace / Job</option>
                                    <option value="hospital">Hospital / EMS</option>
                                    <option value="police">Police / Gov</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-400">X Coordinate</label>
                                    <input
                                        name="x_position"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={coords.x}
                                        onChange={(e) => setCoords({ ...coords, x: Number(e.target.value) })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-400">Y Coordinate</label>
                                    <input
                                        name="y_position"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={coords.y}
                                        onChange={(e) => setCoords({ ...coords, y: Number(e.target.value) })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-400">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Usage guidelines, key info..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-400">Location Image</label>
                                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/50">
                                    <ImageUpload
                                        onUpload={(url) => {
                                            if (Array.isArray(url)) {
                                                setImageUrl(url[0] || null)
                                            } else {
                                                setImageUrl(url)
                                            }
                                        }}
                                    />
                                </div>
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
                                    Create Location
                                </>
                            )}
                        </button>
                    </form>

                    {/* Right Column: Interactive Picker */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-400">Map Selector</label>
                        <p className="text-xs text-slate-500 mb-2">Click on the map to set the location coordinates.</p>
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <LocationPickerWrapper
                                onLocationSelect={(x, y) => setCoords({ x, y })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
