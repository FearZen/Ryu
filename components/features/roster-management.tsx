'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Shield, Save, Loader2, Crown, Plus, Trash2, Edit2, X, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ImageUpload from './image-upload'

type RosterMember = {
    id: string
    name: string
    ranks: string[]
    avatar_url: string | null
    bio: string | null
    status: string
}

const ALL_RANKS = ['Boss', 'OG', 'Vice', 'SDM', 'Punisher', 'Brangkas', 'RC']

export default function RosterManagement({ initialRoster }: { initialRoster: RosterMember[] }) {
    const [roster, setRoster] = useState<RosterMember[]>(initialRoster)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [isEditing, setIsEditing] = useState<RosterMember | null>(null)

    // Form Stats
    const [formData, setFormData] = useState<Partial<RosterMember>>({
        name: '',
        ranks: [],
        avatar_url: '',
        bio: '',
        status: 'Active'
    })

    const supabase = createClient()
    const router = useRouter()

    const filteredRoster = roster.filter(p =>
        (p.name?.toLowerCase() || '').includes(search.toLowerCase())
    )

    const handleCreate = async () => {
        if (!formData.name) return alert('Name is required')
        // Ensure ranks is an array
        const payload = {
            ...formData,
            ranks: formData.ranks || []
        }
        setLoading('create')

        const { data, error } = await supabase
            .from('roster')
            .insert([payload])
            .select()
            .single()

        if (!error && data) {
            setRoster([data, ...roster])
            setIsCreating(false)
            setFormData({ name: '', ranks: [], avatar_url: '', bio: '', status: 'Active' })
            router.refresh()
        } else {
            alert('Error creating member: ' + error?.message)
        }
        setLoading(null)
    }

    const handleUpdate = async () => {
        if (!isEditing || !formData.name) return
        setLoading('update')

        const { error } = await supabase
            .from('roster')
            .update(formData)
            .eq('id', isEditing.id)

        if (!error) {
            setRoster(roster.map(p => p.id === isEditing.id ? { ...p, ...formData } as RosterMember : p))
            setIsEditing(null)
            router.refresh()
        } else {
            alert('Error updating member: ' + error.message)
        }
        setLoading(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this member from the roster?')) return
        setLoading(id)

        const { error } = await supabase.from('roster').delete().eq('id', id)

        if (!error) {
            setRoster(roster.filter(p => p.id !== id))
            router.refresh()
        } else {
            alert('Error deleting member: ' + error.message)
        }
        setLoading(null)
    }

    const toggleRank = (rank: string) => {
        const currentRanks = formData.ranks || []
        if (currentRanks.includes(rank)) {
            setFormData({ ...formData, ranks: currentRanks.filter(r => r !== rank) })
        } else {
            setFormData({ ...formData, ranks: [...currentRanks, rank] })
        }
    }

    const openEdit = (member: RosterMember) => {
        setIsEditing(member)
        setFormData(member)
    }

    const openCreate = () => {
        setFormData({ name: '', ranks: [], avatar_url: '', bio: '', status: 'Active' })
        setIsCreating(true)
    }

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search roster..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Member
                </button>
            </div>

            {/* Editor Modal (Create/Edit) */}
            {(isCreating || isEditing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => { setIsCreating(false); setIsEditing(null) }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">
                            {isCreating ? 'Add New Member' : 'Edit Member'}
                        </h2>

                        <div className="space-y-6">
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 relative rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                                    {formData.avatar_url ? (
                                        <Image src={formData.avatar_url} alt="Av" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="w-full max-w-xs">
                                    <ImageUpload
                                        onUpload={(url) => setFormData({ ...formData, avatar_url: url as string })}
                                        defaultValue={formData.avatar_url || ''}
                                        bucketName="roster-images"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                        placeholder="Member Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="MIA">MIA</option>
                                        <option value="Retired">Retired</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ranks (Select multiple)</label>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_RANKS.map(rank => (
                                        <button
                                            key={rank}
                                            onClick={() => toggleRank(rank)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${formData.ranks?.includes(rank)
                                                ? 'bg-blue-600 border-blue-500 text-white'
                                                : 'bg-black/50 border-white/10 text-slate-400 hover:bg-white/5'
                                                }`}
                                        >
                                            {rank}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bio / Intel</label>
                                <textarea
                                    value={formData.bio || ''}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-24"
                                    placeholder="Enter member details..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => { setIsCreating(false); setIsEditing(null) }}
                                    className="px-6 py-2 rounded-lg text-slate-400 hover:text-white font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={isCreating ? handleCreate : handleUpdate}
                                    disabled={!!loading}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {isCreating ? 'Create Member' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRoster.map(member => (
                    <div key={member.id} className="bg-slate-900 border border-white/10 rounded-xl p-4 flex items-center gap-4 group hover:border-blue-500/30 transition-colors">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden relative border border-white/10">
                            {member.avatar_url ? (
                                <Image src={member.avatar_url} alt="Av" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                    {member.name[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate">{member.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {member.ranks?.slice(0, 3).map(r => (
                                    <span key={r} className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-slate-400 border border-white/5">
                                        {r}
                                    </span>
                                ))}
                                {(member.ranks?.length || 0) > 3 && (
                                    <span className="text-[10px] text-slate-500 px-1">+{member.ranks!.length - 3}</span>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openEdit(member)}
                                className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(member.id)}
                                className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredRoster.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-xl">
                        No members found.
                    </div>
                )}
            </div>
        </div>
    )
}
