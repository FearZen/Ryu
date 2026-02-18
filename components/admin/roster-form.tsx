"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Plus, Save } from "lucide-react";
import Image from "next/image";

interface RosterMember {
    id?: string;
    name: string;
    ranks: string[];
    avatar_url: string | null;
    bio: string | null;
    status: string;
}

interface RosterFormProps {
    initialData?: RosterMember;
    isEditing?: boolean;
}

export default function RosterForm({ initialData, isEditing = false }: RosterFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<RosterMember>({
        name: initialData?.name || "",
        ranks: initialData?.ranks || [],
        avatar_url: initialData?.avatar_url || null,
        bio: initialData?.bio || "",
        status: initialData?.status || "Active",
    });

    const [newRank, setNewRank] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddRank = () => {
        if (newRank.trim()) {
            setFormData({ ...formData, ranks: [...formData.ranks, newRank.trim()] });
            setNewRank("");
        }
    };

    const handleRemoveRank = (index: number) => {
        const newRanks = [...formData.ranks];
        newRanks.splice(index, 1);
        setFormData({ ...formData, ranks: newRanks });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!e.target.files || e.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('roster-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('roster-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, avatar_url: publicUrl });
        } catch (error: any) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing && initialData?.id) {
                const { error } = await supabase
                    .from('roster')
                    .update({
                        name: formData.name,
                        ranks: formData.ranks,
                        avatar_url: formData.avatar_url,
                        bio: formData.bio,
                        status: formData.status,
                    })
                    .eq('id', initialData.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('roster')
                    .insert([{
                        name: formData.name,
                        ranks: formData.ranks,
                        avatar_url: formData.avatar_url,
                        bio: formData.bio,
                        status: formData.status,
                    }]);

                if (error) throw error;
            }

            router.push('/admin/roster');
            router.refresh();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Avatar Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-400">Avatar Image</label>
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden relative">
                        {formData.avatar_url ? (
                            <Image
                                src={formData.avatar_url}
                                alt="Avatar Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Upload className="w-8 h-8 text-slate-500" />
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="avatar"
                            className={`px-4 py-2 rounded-xl bg-slate-800 text-white font-bold cursor-pointer hover:bg-slate-700 transition-colors inline-block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? 'Uploading...' : 'Choose Image'}
                        </label>
                        <p className="text-xs text-slate-500 mt-2">Recommended: 500x500px or square aspect ratio.</p>
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-slate-400">Member Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. John Doe"
                />
            </div>

            {/* Ranks */}
            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-400">Ranks / Roles</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={newRank}
                        onChange={(e) => setNewRank(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRank())}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Add a rank (e.g. Captain)"
                    />
                    <button
                        type="button"
                        onClick={handleAddRank}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.ranks.map((rank, index) => (
                        <div key={index} className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            <span>{rank}</span>
                            <button type="button" onClick={() => handleRemoveRank(index)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {formData.ranks.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No ranks added yet.</p>
                    )}
                </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-bold text-slate-400">Status</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="LoA">LoA (Leave of Absence)</option>
                    <option value="Retired">Retired</option>
                </select>
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-bold text-slate-400">Bio (Optional)</label>
                <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Short description or notes about the member..."
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Save className="w-5 h-5" />
                )}
                {isEditing ? 'Save Changes' : 'Create Member'}
            </button>
        </form>
    );
}
