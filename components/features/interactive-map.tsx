'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, Info } from 'lucide-react'
import { MapLocation } from '@/types'
import clsx from 'clsx'

type Props = {
    locations: MapLocation[]
}

export default function InteractiveMap({ locations }: Props) {
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)

    return (
        <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
            {/* Map Background - Replace with actual GTA Map Image */}
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Solid_black.svg/2048px-Solid_black.svg.png')] bg-cover opacity-50" />
            <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />

            {/* Fallback Text if no image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-slate-700 font-bold text-4xl tracking-widest opacity-20">
                    LOS SANTOS MAP
                </p>
            </div>

            {/* Pins */}
            {locations.map((loc) => (
                <motion.button
                    key={loc.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedLocation(loc)}
                    style={{ left: `${loc.x_position}%`, top: `${loc.y_position}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 p-2 group/pin"
                >
                    <div className={clsx(
                        "relative w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_15px_currentColor]",
                        loc.type === 'base' ? 'bg-red-600 text-white' :
                            loc.type === 'gathering' ? 'bg-green-600 text-white' :
                                'bg-blue-600 text-white'
                    )}>
                        <MapPin className="w-4 h-4" />

                        {/* Hover Tooltip name */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                            {loc.name}
                        </div>
                    </div>
                </motion.button>
            ))}

            {/* Selected Location Modal / Popup */}
            <AnimatePresence>
                {selectedLocation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-4 right-4 md:right-8 w-80 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 z-20 shadow-2xl"
                    >
                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-2 pr-8">{selectedLocation.name}</h3>
                        <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-xs text-slate-300 uppercase mb-4">
                            {selectedLocation.type}
                        </span>

                        {selectedLocation.image_url && (
                            <div className="aspect-video rounded-lg overflow-hidden bg-black/50 mb-4 border border-white/5">
                                <img src={selectedLocation.image_url} alt={selectedLocation.name} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <p className="text-sm text-slate-400 leading-relaxed">
                            {selectedLocation.description || "No description available."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
