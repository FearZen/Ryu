"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicPlayerProps {
    playing: boolean;
    onToggle: () => void;
}

export default function MusicPlayer({ playing, onToggle }: MusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // Use the renamed file
    const url = "/ryu-theme.mp3";

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : volume;
        }
    }, [volume, muted]);

    useEffect(() => {
        if (audioRef.current) {
            if (playing) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Audio playback failed:", error);
                        // Auto-toggle off if playback is denied to reflect UI state
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [playing]);

    const toggleMute = () => {
        setMuted(!muted);
        if (muted) setVolume(0.7);
        else setVolume(0);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex items-end gap-4"
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            {/* Native Audio Element */}
            <audio
                ref={audioRef}
                src={url}
                loop
                preload="auto"
            />

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[280px]"
                    >
                        {/* Album Art / Visualizer Placeholder */}
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                            {playing ? (
                                <div className="flex items-end justify-center gap-1 h-6">
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1 bg-blue-400 rounded-full"
                                            animate={{
                                                height: ["20%", "90%", "30%"],
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                delay: i * 0.1,
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Music className="w-6 h-6 text-blue-400" />
                            )}
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white text-xs font-bold truncate max-w-[120px]">RYU Official Audio</h3>
                                <div className="flex items-center gap-2">
                                    <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
                                        {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Volume Slider */}
                            <div className="relative w-full h-1 bg-slate-700 rounded-full group cursor-pointer">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                                    style={{ width: `${muted ? 0 : volume * 100}%` }}
                                    layout
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={muted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggle}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-white/10 transition-all z-50 ${playing
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 backdrop-blur-md"
                    }`}
            >
                {playing ? (
                    <motion.div
                        key="pause"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative"
                    >
                        <Pause className="w-6 h-6 fill-current" />
                        {/* Pulse Effect */}
                        <span className="absolute -inset-4 rounded-full border border-white/30 animate-ping opacity-50" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="play"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <Play className="w-6 h-6 fill-current pl-1" />
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}
