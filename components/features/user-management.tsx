'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { Search, Shield, Save, Loader2, Crown } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function UserManagement({ initialProfiles }: { initialProfiles: Profile[] }) {
    const [profiles, setProfiles] = useState(initialProfiles)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()

    const filteredProfiles = profiles.filter(p =>
        (p.username?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (p.id).includes(search)
    )

    const handleUpdate = async (id: string, updates: Partial<Profile>) => {
        setLoading(id)
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)

        if (!error) {
            setProfiles(profiles.map(p => p.id === id ? { ...p, ...updates } : p))
            router.refresh()
        } else {
            alert('Failed to update: ' + error.message)
        }
        setLoading(null)
    }

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search agents by name or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredProfiles.map(profile => (
                    <div key={profile.id} className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden relative border border-white/10">
                            {profile.avatar_url ? (
                                <Image src={profile.avatar_url} alt="Av" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                    {profile.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-white">{profile.username || 'Unknown Agent'}</h3>
                            <p className="text-xs text-slate-500 font-mono">{profile.id}</p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            {/* Role Select */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <Shield className="w-3 h-3" />
                                </div>
                                <select
                                    className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-8 text-sm text-white appearance-none cursor-pointer hover:border-blue-500/50 focus:border-blue-500"
                                    value={profile.role}
                                    onChange={(e) => handleUpdate(profile.id, { role: e.target.value as any })}
                                    disabled={loading === profile.id}
                                >
                                    <option value="member">Member</option>
                                    <option value="treasurer">Treasurer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Rank Select/Input */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500/70">
                                    <Crown className="w-3 h-3" />
                                </div>
                                <select
                                    className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-8 text-sm text-white appearance-none cursor-pointer hover:border-amber-500/50 focus:border-amber-500"
                                    value={profile.hierarchy_rank || 'Member'}
                                    onChange={(e) => handleUpdate(profile.id, { hierarchy_rank: e.target.value })}
                                    disabled={loading === profile.id}
                                >
                                    <option value="Member">Member</option>
                                    <option value="Captain">Captain (RC)</option>
                                    <option value="Treasurer">Treasurer (Brangkas)</option>
                                    <option value="Enforcer">Enforcer (Punisher)</option>
                                    <option value="HR">HR (SDM)</option>
                                    <option value="Vice">Vice</option>
                                    <option value="OG">OG</option>
                                    <option value="Warlord">Warlord (Boss)</option>
                                </select>
                            </div>

                            {loading === profile.id && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                        </div>
                    </div>
                ))}

                {filteredProfiles.length === 0 && (
                    <div className="text-center py-8 text-slate-500">No agents found.</div>
                )}
            </div>
        </div>
    )
}
