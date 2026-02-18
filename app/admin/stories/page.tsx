"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Calendar, Layout } from "lucide-react";
import Image from "next/image";
import AdminNav from "@/components/layout/admin-nav";
import StoryForm, { Story } from "@/components/features/story-form";

export default function StoriesPage() {
    const supabase = createClient();
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<Story | null>(null);

    const fetchStories = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("stories")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching stories:", error);
        } else {
            setStories(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this story?")) return;

        const { error } = await supabase.from("stories").delete().eq("id", id);
        if (error) {
            alert("Failed to delete story");
        } else {
            fetchStories();
        }
    };

    const handleEdit = (story: Story) => {
        setEditingStory(story);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setEditingStory(null);
        fetchStories();
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-400">Loading stories...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Layout className="w-8 h-8 text-blue-500" />
                            STORIES CMS
                        </h1>
                        <p className="text-slate-400 mt-2">Manage the storyboard timeline content.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingStory(null);
                            setIsFormOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Story
                    </button>
                </div>

                {isFormOpen ? (
                    <div className="mb-8">
                        <StoryForm
                            initialData={editingStory}
                            onSuccess={handleFormSuccess}
                            onCancel={() => {
                                setIsFormOpen(false);
                                setEditingStory(null);
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {stories.map((story) => (
                            <div
                                key={story.id}
                                className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group"
                            >
                                <div className="relative h-48 w-full bg-slate-800">
                                    {story.image_url ? (
                                        <Image
                                            src={story.image_url}
                                            alt={story.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-500">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(story)}
                                            className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 shadow-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(story.id)}
                                            className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-500 shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {story.subtitle || "No Date"}
                                        </div>
                                        {story.category && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider border border-white/10">
                                                {story.category}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mt-1">{story.title}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-3">
                                        {story.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {stories.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                                No stories found. Create one to get started.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
