import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface IntroOverlayProps {
    onEnter: () => void;
}

const backgroundImages = [
    "/header1.png",
    "/header2.png",
    "/header3.png",
];

export default function IntroOverlay({ onEnter }: IntroOverlayProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            onClick={onEnter}
        >
            {/* Background Slideshow */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={backgroundImages[currentImageIndex]}
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black z-10" />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-center space-y-8 relative z-20 flex flex-col items-center"
            >
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter drop-shadow-2xl">
                    RYU SIXNINE
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative w-32 h-32 group">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-all duration-500 animate-pulse" />
                        <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                            <Image
                                src="/ryunaga3.png"
                                alt="Enter"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm tracking-[0.2em] uppercase font-light">
                        Click to Enter
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>,
        document.body
    );
}
