"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import IntroOverlay from "./intro-overlay";
import MusicPlayer from "./music-player";

export default function AudioManager() {
    const pathname = usePathname();
    const [hasEntered, setHasEntered] = useState(false);
    const [playing, setPlaying] = useState(false);

    // Define allowed paths for music
    const allowedPaths = ['/', '/map', '/gallery'];
    const isAllowed = allowedPaths.includes(pathname || '');

    // Stop playing if navigating away from allowed paths
    useEffect(() => {
        if (!isAllowed) {
            setPlaying(false);
        }
    }, [pathname, isAllowed]);


    if (!isAllowed) return null;

    const handleEnter = () => {
        setHasEntered(true);
        setPlaying(true);
    };

    return (
        <>
            {!hasEntered && <IntroOverlay onEnter={handleEnter} />}
            <MusicPlayer
                playing={playing}
                onToggle={() => setPlaying(!playing)}
            />
        </>
    );
}
