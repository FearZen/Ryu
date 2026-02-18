'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import AdminNav from '@/components/layout/admin-nav'
import MultiImageUpload from '@/components/features/multi-image-upload'

export default function NewGalleryPage() {
    const router = useRouter()
    const supabase = createClient()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // Callback when images change (add or remove)
    const handleImagesChange = (urls: string[]) => {
        setUploadedUrls(urls)
        setErrorMsg(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (uploadedUrls.length === 0) return

        setIsSubmitting(true)
        setErrorMsg(null)

        try {
            // Create ONE record for the Album containing ALL uploaded images
            const albumRecord = {
                image_urls: uploadedUrls,
                title: title || 'Untitled Album',
                description: description || null
            }

            console.log('Attempting to save album:', albumRecord)

            const { error, data } = await supabase
                .from('gallery')
                .insert(albumRecord)
                .select()

            if (error) {
                console.error('Supabase Error Details:', error)
                throw new Error(error.message || 'Unknown Supabase Error')
            }

            console.log('Saved successfully:', data)

            router.push('/admin/gallery')
            router.refresh()
        } catch (error: any) {
            console.error('Error saving gallery album:', error)
            setErrorMsg(error.message || 'Failed to save items. Check console for details.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/admin/gallery"
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white">Upload Album</h1>
                        <p className="text-slate-400">Create a new gallery entry. Multiple photos will be grouped as an album.</p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Error Saving Album</p>
                            <p className="text-sm opacity-90">{errorMsg}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Batch Metadata */}
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Album Title / Event Name
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. City Hall Raid - Feb 2026"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the event or photos..."
                                rows={3}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
                        <label className="block text-sm font-medium text-slate-300 mb-4">
                            Photos
                        </label>
                        <MultiImageUpload onChange={handleImagesChange} />
                    </div>

                    {/* Actions */}
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadedUrls.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Create Album ({uploadedUrls.length} Photos)
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    )
}
