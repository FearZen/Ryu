"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save } from "lucide-react";
import ImageUpload from "@/components/features/image-upload";

export type Story = {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    image_url: string | null;
    category: string | null;
    created_at: string;
};

interface StoryFormProps {
    initialData?: Story | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function StoryForm({ initialData, onSuccess, onCancel }: StoryFormProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
        description: initialData?.description || "",
        image_url: initialData?.image_url || "",
        category: initialData?.category || "General",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const storyData = {
                title: formData.title,
                subtitle: formData.subtitle,
                description: formData.description,
                image_url: formData.image_url,
                category: formData.category,
            };

            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from("stories")
                    .update(storyData)
                    .eq("id", initialData.id);

                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase.from("stories").insert([storyData]);

                if (error) throw error;
            }

            onSuccess();
        } catch (error) {
            console.error("Error saving story:", error);
            alert("Failed to save story");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = useCallback((url: string | string[]) => {
        setFormData(prev => ({ ...prev, image_url: url as string }));
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
                {initialData ? "Edit Story" : "Add New Story"}
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. The Arrival"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Subtitle / Year / Event
                    </label>
                    <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 2024"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Category
                    </label>
                    <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. War, Kidnapping"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Description
                    </label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Detailed story description..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Cover Image
                    </label>
                    <ImageUpload
                        onUpload={handleImageUpload}
                        defaultValue={formData.image_url}
                        bucketName="story-images"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Story
                </button>
            </div>
        </form>
    );
}
