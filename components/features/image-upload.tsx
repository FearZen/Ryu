'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

type Props = {
    onUpload: (url: string | string[]) => void
    defaultValue?: string | string[]
    initialImage?: string // Legacy prop support
    multiple?: boolean
    bucketName?: string // Optional bucket name
}

export default function ImageUpload({ onUpload, defaultValue, initialImage, multiple = false, bucketName = 'ryu-assets' }: Props) {
    // State to hold array of URLs
    const [imageUrls, setImageUrls] = useState<string[]>(() => {
        if (Array.isArray(defaultValue)) return defaultValue
        if (typeof defaultValue === 'string' && defaultValue) return [defaultValue]
        if (initialImage) return [initialImage]
        return []
    })

    const [uploading, setUploading] = useState(false)
    const supabase = createClient()

    // Sync state with parent callback
    useEffect(() => {
        if (multiple) {
            onUpload(imageUrls)
        } else {
            onUpload(imageUrls[0] || '')
        }
    }, [imageUrls, multiple, onUpload])

    const processFiles = async (files: FileList | File[]) => {
        if (!files || files.length === 0) return

        try {
            setUploading(true)
            const newUrls: string[] = []

            for (const file of Array.from(files)) {
                // Validate file type
                if (!file.type.startsWith('image/')) continue

                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `uploads/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from(bucketName) // Use dynamic bucket name
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data } = supabase.storage
                    .from(bucketName) // Use dynamic bucket name
                    .getPublicUrl(filePath)

                newUrls.push(data.publicUrl)
            }

            if (multiple) {
                setImageUrls(prev => [...prev, ...newUrls])
            } else {
                setImageUrls([newUrls[0]])
            }

        } catch (error) {
            alert('Error uploading image!')
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files)
        }
    }

    const removeImage = (indexToRemove: number) => {
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            {imageUrls.length > 0 && (
                <div className={`grid gap-4 ${multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                    {imageUrls.map((url, index) => (
                        <div key={url} className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 group bg-slate-900">
                            <Image src={url} alt="Uploaded" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area - Show if multiple or if no image selected */}
            {(multiple || imageUrls.length === 0) && (
                <label
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 hover:border-green-500/50 transition-all group"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        {uploading ? (
                            <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                        ) : (
                            <>
                                <div className="p-3 bg-white/5 rounded-full mb-2 group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-green-500" />
                                </div>
                                <p className="text-sm text-slate-400 group-hover:text-slate-200">
                                    <span className="font-bold text-green-500">Click</span> or drag {multiple ? 'images' : 'image'}
                                </p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple={multiple}
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            )}

            {/* Hidden inputs for form submission compatibility */}
            {multiple ? (
                imageUrls.map((url, i) => (
                    <input key={i} type="hidden" name="image_urls" value={url} />
                ))
            ) : (
                <input type="hidden" name="image_url" value={imageUrls[0] || ''} />
            )}
        </div>
    )
}
