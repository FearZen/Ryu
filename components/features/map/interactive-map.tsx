'use client'

import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapLocation } from '@/types'
import L from 'leaflet'
import { useEffect } from 'react'
import Image from 'next/image'
import { renderToStaticMarkup } from 'react-dom/server'
import { Shield, Hammer, MapPin, Briefcase, HeartPulse, ShieldAlert, Archive } from 'lucide-react'

// Custom Elite Marker Generator
const getIcon = (type: string) => {
    let color = '#3b82f6'; // blue (General)
    let iconNode = <MapPin className="w-4 h-4 text-white" />;

    if (type === 'base') { color = '#ef4444'; iconNode = <ShieldAlert className="w-4 h-4 text-white" />; }
    if (type === 'gathering') { color = '#10b981'; iconNode = <Hammer className="w-4 h-4 text-white" />; }
    if (type === 'storage') { color = '#f59e0b'; iconNode = <Archive className="w-4 h-4 text-white" />; }
    if (type === 'work') { color = '#8b5cf6'; iconNode = <Briefcase className="w-4 h-4 text-white" />; }
    if (type === 'hospital') { color = '#ec4899'; iconNode = <HeartPulse className="w-4 h-4 text-white" />; }
    if (type === 'police') { color = '#0ea5e9'; iconNode = <Shield className="w-4 h-4 text-white" />; }

    const html = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-8 h-8 group">
            {/* Pulse Effect */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: color }} />

            {/* Main Marker Circle */}
            <div className="relative z-10 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: color }}>
                {iconNode}
            </div>

            {/* Tooltip-like Line */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-3 bg-white/50" />
        </div>
    )

    return L.divIcon({
        className: 'custom-div-icon bg-transparent',
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 44],
        popupAnchor: [0, -48]
    })
}

interface InteractiveMapProps {
    locations: MapLocation[]
}

const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]];

function MapController() {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(bounds);
    }, [map]);
    return null;
}

export default function InteractiveMap({ locations }: InteractiveMapProps) {
    return (
        <div className="relative w-full h-full p-0 bg-transparent rounded-3xl overflow-hidden group">
            {/* Tech Frame Decors */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-500/50 rounded-tl-3xl z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500/50 rounded-tr-3xl z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/50 rounded-bl-3xl z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-500/50 rounded-br-3xl z-20 pointer-events-none" />

            <MapContainer
                crs={L.CRS.Simple}
                bounds={bounds}
                center={[500, 500]}
                zoom={2}
                minZoom={1}
                maxZoom={6}
                className="w-full h-full rounded-2xl z-0 bg-[#0fa8d2] isolate"
                scrollWheelZoom={true}
            >
                <ImageOverlay
                    url="/map.png"
                    bounds={bounds}
                />

                <MapController />

                {locations.map(loc => (
                    <Marker
                        key={loc.id}
                        position={[loc.y_position * 10, loc.x_position * 10]}
                        icon={getIcon(loc.type)}
                    >
                        <Popup className="custom-popup" closeButton={false}>
                            <div className="p-0 min-w-[250px] bg-slate-950 border border-blue-500/30 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                {/* Header */}
                                <div className="bg-slate-900 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">{loc.name}</h3>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>

                                <div className="p-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm mb-3 inline-block border bg-opacity-10
                                        ${loc.type === 'base' ? 'bg-red-500 text-red-400 border-red-500/30' :
                                            loc.type === 'gathering' ? 'bg-emerald-500 text-emerald-400 border-emerald-500/30' :
                                                'bg-blue-500 text-blue-400 border-blue-500/30'}`}>
                                        {loc.type.toUpperCase()}
                                    </span>

                                    {loc.image_url && (
                                        <div className="relative aspect-video rounded-sm overflow-hidden mb-3 border border-white/10 group-hover:border-blue-500/30 transition-colors">
                                            <Image
                                                src={loc.image_url}
                                                alt={loc.name}
                                                fill
                                                className="object-cover"
                                            />
                                            {/* Scanline overlay on image */}
                                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-30 pointer-events-none" />
                                        </div>
                                    )}

                                    {loc.description && (
                                        <p className="text-xs text-slate-400 leading-relaxed font-mono">
                                            {loc.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Use global Scanline if available, or local override */}
            <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-30 z-10" />

            {/* GTA 5 Style Legend (Top Right) */}
            <div className="absolute top-6 right-6 z-[1000] bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-5 w-56 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <h3 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-4 border-b border-white/10 pb-2">
                    Territory Legend
                </h3>
                <div className="space-y-3">
                    {[
                        { color: 'bg-red-500', label: 'Faction Base', shadow: 'shadow-red-500/50' },
                        { color: 'bg-emerald-500', label: 'Gathering', shadow: 'shadow-emerald-500/50' },
                        { color: 'bg-purple-500', label: 'Workplace', shadow: 'shadow-purple-500/50' },
                        { color: 'bg-sky-500', label: 'Police', shadow: 'shadow-sky-500/50' },
                        { color: 'bg-pink-500', label: 'Hospital', shadow: 'shadow-pink-500/50' },
                        { color: 'bg-amber-500', label: 'Storage', shadow: 'shadow-amber-500/50' },
                        { color: 'bg-blue-500', label: 'General', shadow: 'shadow-blue-500/50' },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px] ${item.shadow}`}></div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
