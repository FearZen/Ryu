import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Trash2, Calendar, Layers, Pencil } from "lucide-react";
import AdminNav from "@/components/layout/admin-nav";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function AdminGalleryPage() {
    const supabase = await createClient();
    const { data: galleryItems } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

    async function deleteImage(id: string) {
        "use server";
        const supabase = await createClient();
        await supabase.from("gallery").delete().eq("id", id);
        revalidatePath("/admin/gallery");
        revalidatePath("/gallery");
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
                            Gallery Management
                        </h1>
                        <p className="text-slate-400">
                            Manage albums and photos displayed in the public gallery.
                        </p>
                    </div>
                    <Link
                        href="/admin/gallery/new"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Album
                    </Link>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {galleryItems?.map((item) => (
                        <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
                            {item.image_urls && item.image_urls.length > 0 ? (
                                <img
                                    src={item.image_urls[0]}
                                    alt={item.title || "Album Cover"}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 text-xs">
                                    No Cover
                                </div>
                            )}

                            {/* Album Badge */}
                            {item.image_urls && item.image_urls.length > 1 && (
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1">
                                    <Layers className="w-3 h-3" />
                                    {item.image_urls.length}
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                <p className="text-white font-bold text-sm truncate">
                                    {item.title || "Untitled"}
                                </p>
                                <div className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.created_at).toLocaleDateString()}
                                </div>

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Link
                                        href={`/admin/gallery/${item.id}`}
                                        className="p-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <form action={deleteImage.bind(null, item.id)}>
                                        <button
                                            type="submit"
                                            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!galleryItems || galleryItems.length === 0) && (
                        <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-white/10 rounded-3xl">
                            <p>No albums created yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
