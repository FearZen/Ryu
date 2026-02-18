import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";
import { deleteCraftingItem } from "@/lib/actions/crafting";
import { CraftingItem } from "@/types";
import AdminNav from "@/components/layout/admin-nav";

export const revalidate = 0; // Always dynamic for admin

export default async function AdminCraftingPage() {
    const supabase = await createClient();
    const { data: items } = await supabase
        .from("crafting_items")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
                            Manage Blueprints
                        </h1>
                        <p className="text-slate-400">
                            Create and edit crafting recipes.
                        </p>
                    </div>
                    <Link
                        href="/admin/crafting/new"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg hover:shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Item
                    </Link>
                </div>

                <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-slate-400 font-bold text-sm uppercase tracking-wider">
                            <tr>
                                <th className="p-6">Name</th>
                                <th className="p-6">Category</th>
                                <th className="p-6">Estimated Price</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items?.map((item: any) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-white/10 relative overflow-hidden shrink-0">
                                            {item.image_url && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <span className="font-bold text-white text-lg">{item.name}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300 uppercase font-bold tracking-wide border border-white/5">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-6 text-green-400 font-mono font-bold">
                                        ${item.base_price?.toLocaleString()}
                                    </td>
                                    <td className="p-6 text-right flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/admin/crafting/${item.id}`}
                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="Edit Blueprint"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>

                                        <form action={deleteCraftingItem.bind(null, item.id)}>
                                            <button
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete Blueprint"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}

                            {(!items || items.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500">
                                        No blueprints found. Get started by adding one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
