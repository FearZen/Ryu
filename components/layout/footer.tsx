import Link from 'next/link'
import Image from 'next/image'
import { Hammer, Map, Image as ImageIcon, ExternalLink, Github, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="w-full bg-black/30 backdrop-blur-xl pt-24 pb-12 relative z-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-12 h-12 relative overflow-hidden rounded-full border border-blue-500/30 group-hover:border-blue-500 transition-colors">
                                <Image
                                    src="/ryu.gif"
                                    alt="Ryu Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors">
                                    RYU
                                </span>
                                <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">
                                    Sixnine City
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-400 leading-relaxed max-w-xs">
                            Dominance through loyalty. Respect through action. The elite faction of Sixnine City.
                        </p>
                    </div>

                    {/* Navigation Column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-bold tracking-widest uppercase text-sm mb-2">Navigation</h3>
                        <Link href="/map" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 w-fit">
                            <Map className="w-4 h-4" /> Territory Map
                        </Link>
                        <Link href="/gallery" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 w-fit">
                            <ImageIcon className="w-4 h-4" /> Gallery
                        </Link>
                    </div>

                    {/* Socials / Contact Column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-bold tracking-widest uppercase text-sm mb-2">Connect</h3>
                        <Link
                            href="https://www.tiktok.com/@bluuedragon"
                            target="_blank"
                            className="bg-slate-900 border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
                        >
                            <div className="p-2 bg-black rounded-lg border border-white/5 group-hover:border-blue-500/30">
                                {/* Simple TikTok Icon representation or generic link icon */}
                                <ExternalLink className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase font-bold">Follow on TikTok</span>
                                <span className="text-white font-bold group-hover:text-blue-400 transition-colors">@bluuedragon</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-600">
                        &copy; {new Date().getFullYear()} RYU SIXNINE. All Rights Reserved.
                    </p>
                    <p className="text-xs text-slate-700 font-mono">
                        System Online // Secure Connection
                    </p>
                </div>
            </div>
        </footer>
    )
}
