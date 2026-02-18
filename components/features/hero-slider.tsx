'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const images = [
    '/header1.png',
    '/header2.png',
    '/header3.png',
]

export default function HeroSlider() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length)
        }, 5000) // Change every 5 seconds

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />

            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={images[index]}
                        alt={`Hero Background ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Glitch Overlay Effect (Optional) */}
            <div className="absolute inset-0 z-20 opacity-10 pointer-events-none bg-[url('/noise.png')] mix-blend-overlay" />
        </div>
    )
}
