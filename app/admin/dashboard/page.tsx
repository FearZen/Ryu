import Link from "next/link";
import { Hammer, Map, Image as ImageIcon, LayoutDashboard, Plus, Eye, Wallet, Layers, Box } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/layout/admin-nav";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Check Auth & Profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                            Dashboard
                        </h1>
                        <p className="text-slate-400">
                            Welcome back, <span className="text-blue-400 font-bold">{profile?.username || 'Admin'}</span>.
                        </p>
                        {profile?.bio && (
                            <p className="text-sm text-slate-500 mt-1 italic">"{profile.bio}"</p>
                        )}
                    </div>
                    <div className="bg-slate-900 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">
                            {profile?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-none">{profile?.role?.toUpperCase()}</p>
                            <p className="text-xs text-slate-500">Authorized Personnel</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Crafting Card */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                            <Hammer className="w-7 h-7 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Crafting Blueprints</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Manage recipes, ingredients, and acquisition guides for weapons and items.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/crafting" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center border border-white/5 transition-colors">
                                Manage
                            </Link>
                            <Link href="/admin/crafting/new" className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                                <Plus className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>

                    {/* Materials Card (NEW) */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 hover:border-orange-500/50 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                            <Box className="w-7 h-7 text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Materials</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Manage raw materials, their availability, and properties.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/materials" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center border border-white/5 transition-colors">
                                Manage
                            </Link>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                            <Map className="w-7 h-7 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Map Locations</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Add or edit faction bases, gathering spots, and key territory markers.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/map" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center border border-white/5 transition-colors">
                                Manage
                            </Link>
                            <Link href="/admin/map/new" className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors">
                                <Plus className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>

                    {/* Gallery Card (NEW) */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 hover:border-pink-500/50 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                            <ImageIcon className="w-7 h-7 text-pink-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Photo Gallery</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Upload photos, manage albums, and curate visual storytelling.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/gallery" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center border border-white/5 transition-colors">
                                Manage
                            </Link>
                            <Link href="/admin/gallery/new" className="py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition-colors">
                                <Plus className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>

                    {/* Structure / Roster Card (NEW) */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 hover:border-green-500/50 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                            <LayoutDashboard className="w-7 h-7 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Structure / Roster</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Manage members, ranks, hierarchy, and update the organization structure.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/roster" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center border border-white/5 transition-colors">
                                Manage
                            </Link>
                            <Link href="/admin/roster/new" className="py-3 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white transition-colors">
                                <Plus className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>

                    {/* Treasury Card (NEW) */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 hover:border-yellow-500/50 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                            <Wallet className="w-7 h-7 text-yellow-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Treasury</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Manage faction funds, transactions, and financial records.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/treasury" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center border border-white/5 transition-colors">
                                Manage
                            </Link>
                        </div>
                    </div>

                    {/* Stories Card (NEW) */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 hover:border-cyan-500/50 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                            <Layers className="w-7 h-7 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Stories / Legacy</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Write and publish stories, chronicles, and important events.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/stories" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-center border border-white/5 transition-colors">
                                Manage
                            </Link>
                            <Link href="/admin/stories/new" className="py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
                                <Plus className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
