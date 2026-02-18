'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, X } from 'lucide-react'
import Image from 'next/image'

export type Story = {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    image_url: string | null;
    category: string | null;
    created_at: string;
};

interface StoryboardProps {
    stories: Story[];
}

export default function Storyboard({ stories = [] }: StoryboardProps) {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    // Lock Body Scroll when Modal is Open
    useEffect(() => {
        if (selectedStory) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [selectedStory]);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-20 relative z-20">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter">
                    OUR LEGACY
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    The history of Ryu Sixnine. Written in blood and ambition.
                </p>
            </div>

            <div className="relative space-y-12">
                {stories.length === 0 ? (
                    <div className="text-center text-slate-500">
                        The story is yet to be written...
                    </div>
                ) : (
                    stories.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.7, delay: index * 0.1 }}
                            className="relative group"
                        >
                            {/* Glassmorphism Card Container */}
                            <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8 hover:border-blue-500/20 transition-all shadow-2xl">
                                <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Text Content */}
                                    <div className="flex-1 text-center md:text-left space-y-4 w-full">
                                        <div className={`flex flex-col gap-3 ${index % 2 === 0 ? 'md:items-start' : 'md:items-end md:text-right'}`}>
                                            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                                                {item.category && (
                                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 uppercase tracking-wider shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                                                        {item.category}
                                                    </span>
                                                )}
                                                <div className="inline-flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                                                    <Calendar className="w-3 h-3" />
                                                    {item.subtitle || new Date(item.created_at).getFullYear()}
                                                </div>
                                            </div>

                                            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                                {item.title}
                                            </h3>

                                            <p className="text-slate-300 leading-relaxed font-light line-clamp-3 text-sm md:text-base max-w-xl">
                                                {item.description}
                                            </p>

                                            <button
                                                onClick={() => setSelectedStory(item)}
                                                className="mt-2 text-white text-sm font-bold border-b border-blue-500 pb-0.5 hover:text-blue-400 hover:border-blue-400 transition-colors"
                                            >
                                                Read Full Chapter
                                            </button>
                                        </div>
                                    </div>

                                    {/* Image Card */}
                                    <div
                                        className="relative w-full md:w-[400px] h-64 md:h-72 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all border border-white/10"
                                        onClick={() => setSelectedStory(item)}
                                    >
                                        {item.image_url ? (
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                <span className="text-slate-600 font-mono text-4xl font-bold opacity-20">RYU</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Fullscreen Modal - Increased Z-Index to cover Nav */}
            <AnimatePresence>
                {selectedStory && (
                    <Portal>
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedStory(null)}
                                className="absolute inset-0 bg-black/95 backdrop-blur-xl pointer-events-auto"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full h-full md:max-w-[95vw] md:max-h-[95vh] bg-slate-900 md:rounded-3xl overflow-y-auto md:overflow-hidden md:border border-white/10 shadow-2xl flex flex-col md:flex-row pointer-events-auto"
                            >
                                <button
                                    onClick={() => setSelectedStory(null)}
                                    className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-black text-white rounded-full transition-colors z-50 backdrop-blur-md border border-white/10 group"
                                >
                                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                                </button>

                                {/* Image Side - Full Height on Desktop */}
                                <div className="relative w-full h-[40vh] md:h-full md:w-3/5 shrink-0 bg-black">
                                    {selectedStory.image_url ? (
                                        <Image
                                            src={selectedStory.image_url}
                                            alt={selectedStory.title}
                                            fill
                                            className="object-contain md:object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-slate-700 font-mono text-9xl font-bold opacity-20">RYU</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r" />
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-slate-900 h-full">
                                    <div className="max-w-xl mx-auto md:mx-0 space-y-8 pt-4 md:pt-20">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                {selectedStory.category && (
                                                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                                                        {selectedStory.category}
                                                    </span>
                                                )}
                                                <span className="text-slate-400 font-mono text-sm tracking-widest border-l border-white/20 pl-3">
                                                    {selectedStory.subtitle}
                                                </span>
                                            </div>
                                            <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tight">
                                                {selectedStory.title}
                                            </h2>
                                        </div>

                                        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-transparent rounded-full" />

                                        <div className="prose prose-invert prose-lg">
                                            <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap font-light">
                                                {selectedStory.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </Portal>
                )}
            </AnimatePresence>
        </section>
    )
}

// Simple Portal Component
function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted ? createPortal(children, document.body) : null;
}
