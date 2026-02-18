'use client'

import { MapContainer, ImageOverlay, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react'
import { Target, Shield } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'

// Custom Elite Marker
const createCustomIcon = () => {
    const html = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 bg-blue-500/30 animate-ping rounded-full" />
            <div className="relative z-10 bg-slate-900 border-2 border-cyan-400 p-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                <Target className="w-5 h-5 text-cyan-400" />
            </div>
            {/* Tech Line */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-4 bg-cyan-400/50" />
        </div>
    )

    return L.divIcon({
        html,
        className: 'bg-transparent',
        iconSize: [40, 40],
        iconAnchor: [20, 56], // Adjust anchor to point correctly
    })
}

const customIcon = createCustomIcon()

const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]];

function LocationMarker({ onLocationSelect, initialPos }: { onLocationSelect: (x: number, y: number) => void, initialPos?: [number, number] }) {
    const [position, setPosition] = useState<L.LatLng | null>(initialPos ? L.latLng(initialPos[0], initialPos[1]) : null)

    useMapEvents({
        click(e) {
            setPosition(e.latlng)
            const x = e.latlng.lng / 10;
            const y = e.latlng.lat / 10;
            onLocationSelect(x, y);
        },
    })

    return position === null ? null : (
        <Marker position={position} icon={customIcon} />
    )
}

export default function LocationPicker({ onLocationSelect, initialPos }: { onLocationSelect: (x: number, y: number) => void, initialPos?: [number, number] }) {
    return (
        <div className="relative w-full p-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
            {/* Tech Frame Decors */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl z-20" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl z-20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl z-20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-xl z-20" />

            <div className="relative rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                <MapContainer
                    crs={L.CRS.Simple}
                    bounds={bounds}
                    center={[500, 500]}
                    zoom={2}
                    minZoom={1}
                    maxZoom={6}
                    className="w-full h-[600px] z-10 bg-[#0fa8d2]"
                    scrollWheelZoom={true}
                >
                    <ImageOverlay
                        url="/map.png"
                        bounds={bounds}
                    />
                    <LocationMarker onLocationSelect={onLocationSelect} initialPos={initialPos} />
                </MapContainer>

                {/* Overlay Grid Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_3px]" />
            </div>
        </div>
    )
}
