'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Info, ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import { GalleryItem } from '@/types'

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const openLightbox = (item: GalleryItem) => {
        setSelectedItem(item)
        setCurrentImageIndex(0) // Reset to first image
    }

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!selectedItem || !selectedItem.image_urls) return
        setCurrentImageIndex((prev) =>
            prev === selectedItem.image_urls.length - 1 ? 0 : prev + 1
        )
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!selectedItem || !selectedItem.image_urls) return
        setCurrentImageIndex((prev) =>
            prev === 0 ? selectedItem.image_urls.length - 1 : prev - 1
        )
    }

    return (
        <>
            {/* Masonry-style Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="break-inside-avoid relative group cursor-zoom-in rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-white/30 transition-all shadow-lg hover:shadow-blue-500/20"
                        onClick={() => openLightbox(item)}
                    >
                        {/* Cover Image */}
                        <div className="relative w-full">
                            {item.image_urls && item.image_urls.length > 0 ? (
                                <img
                                    src={item.image_urls[0]}
                                    alt={item.title || "Gallery Photo"}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="aspect-video bg-slate-800 flex items-center justify-center text-slate-500">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Multi-image Indicator */}
                        {item.image_urls && item.image_urls.length > 1 && (
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 pointer-events-none">
                                <Layers className="w-3 h-3" />
                                {item.image_urls.length}
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-white font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {item.title || "Untitled"}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-300 text-xs translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <p className="text-xl font-light">The gallery is currently empty.</p>
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedItem && selectedItem.image_urls && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                            onClick={() => setSelectedItem(null)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-7xl w-full max-h-[90vh] flex flex-col md:flex-row gap-8 bg-black/50 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white/10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Image Container with Carousel Controls */}
                            <div className="flex-1 relative bg-black flex items-center justify-center min-h-[40vh] md:min-h-full group/image">
                                <motion.img
                                    key={currentImageIndex} // Key allows animation when changing
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={selectedItem.image_urls[currentImageIndex]}
                                    alt={selectedItem.title || "Zoomed Image"}
                                    className="max-w-full max-h-[85vh] object-contain"
                                />

                                {/* Prev Button */}
                                {selectedItem.image_urls.length > 1 && (
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/10 text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                )}

                                {/* Next Button */}
                                {selectedItem.image_urls.length > 1 && (
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/10 text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                )}

                                {/* Image Counter */}
                                {selectedItem.image_urls.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-xs font-bold text-white">
                                        {currentImageIndex + 1} / {selectedItem.image_urls.length}
                                    </div>
                                )}
                            </div>

                            {/* Info Sidebar */}
                            <div className="w-full md:w-[400px] shrink-0 bg-slate-900/90 backdrop-blur-md p-8 flex flex-col justify-center border-l border-white/10">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                        Gallery Album
                                    </div>

                                    <h2 className="text-3xl font-black text-white leading-tight">
                                        {selectedItem.title || "Untitled Capture"}
                                    </h2>

                                    <div className="flex items-center gap-3 text-slate-400 pb-6 border-b border-white/10">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            {new Date(selectedItem.created_at).toLocaleString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    {selectedItem.description && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                Context
                                            </h4>
                                            <p className="text-slate-400 leading-relaxed font-light">
                                                {selectedItem.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Thumbnails (Optional enhanced UX) */}
                                    {selectedItem.image_urls.length > 1 && (
                                        <div className="pt-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">In this album</p>
                                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                                                {selectedItem.image_urls.map((url, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentImageIndex(idx)}
                                                        className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-blue-500' : 'border-transparent opacity-50 hover:opacity-100'
                                                            }`}
                                                    >
                                                        <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
