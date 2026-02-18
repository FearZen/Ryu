import { createClient } from "@/lib/supabase/server";
import GalleryGrid from "@/components/features/gallery/gallery-grid";

export const revalidate = 60; // Revalidate every minute

export default async function GalleryPage() {
    const supabase = await createClient();
    const { data: galleryItems } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
                    Visual Archives
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-purple-400 drop-shadow-2xl">
                    WAR & CULTURE
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                    A glimpse into the life of Ryu Sixnine. From daily operations to major territory takeovers.
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mt-8" />
            </div>

            {/* Gallery Grid */}
            <GalleryGrid items={galleryItems || []} />
        </div>
    );
}
