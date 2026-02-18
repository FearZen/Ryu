'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Props {
    // initialImages: URLs of images already in the album (for editing)
    initialImages?: string[]
    // onChange: Callback with the FULL list of images (existing + new) whenever it changes
    onChange?: (urls: string[]) => void
    disabled?: boolean
}

export default function MultiImageUpload({ initialImages = [], onChange, disabled }: Props) {
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<string[]>(initialImages)
    const supabase = createClient()

    // Initialize state from props if provided (and only on mount/change of prop)
    useEffect(() => {
        if (initialImages.length > 0) {
            setImages(initialImages)
        }
    }, [initialImages])

    const updateImages = (newImages: string[]) => {
        setImages(newImages)
        if (onChange) {
            onChange(newImages)
        }
    }

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return

        setUploading(true)
        const uploadedUrls: string[] = []

        try {
            for (const file of acceptedFiles) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `gallery/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('ryu-assets')
                    .upload(filePath, file)

                if (uploadError) {
                    console.error('Upload error:', uploadError)
                    continue
                }

                const { data } = supabase.storage
                    .from('ryu-assets')
                    .getPublicUrl(filePath)

                uploadedUrls.push(data.publicUrl)
            }

            // Append new uploads to existing images
            const updatedList = [...images, ...uploadedUrls]
            updateImages(updatedList)

        } catch (error) {
            console.error('Error uploading images:', error)
        } finally {
            setUploading(false)
        }
    }, [images, onChange, supabase])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        disabled: disabled || uploading
    })

    const removeImage = (urlToRemove: string) => {
        const updatedList = images.filter(url => url !== urlToRemove)
        updateImages(updatedList)
        // Note: Ideally we should also delete from storage, but for now just UI removal
    }

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                    ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    ) : (
                        <Upload className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} />
                    )}

                    <p className="text-sm font-medium text-slate-300">
                        {uploading ? 'Uploading...' : isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
                    </p>
                    <p className="text-xs text-slate-500">
                        Supports PNG, JPG, GIF, WEBP
                    </p>
                </div>
            </div>

            {/* Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                            <Image
                                src={url}
                                alt="Uploaded preview"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(url)}
                                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
