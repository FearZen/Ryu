import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, MapPin, Trash2, Pencil } from "lucide-react"
import { MapLocation } from "@/types"
import AdminNav from "@/components/layout/admin-nav"
import DeleteMapLocationButton from "@/components/admin/delete-map-location-button"

export const revalidate = 0

export default async function AdminMapPage() {
    const supabase = await createClient()
    const { data: locations } = await supabase
        .from('map_locations')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
                            Map Management
                        </h1>
                        <p className="text-slate-400">
                            Manage operational map points, bases, and territories.
                        </p>
                    </div>
                    <Link
                        href="/admin/map/new"
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Location
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations?.map((loc: MapLocation) => (
                        <div key={loc.id} className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-xl ${loc.type === 'base' ? 'bg-red-500/10 text-red-500' :
                                        loc.type === 'gathering' ? 'bg-emerald-500/10 text-emerald-500' :
                                            loc.type === 'storage' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{loc.name}</h3>
                                        <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">{loc.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-lg p-2 mb-4 font-mono text-xs text-slate-400 flex justify-between">
                                <span>COORDS</span>
                                <span className="text-white">{loc.x_position.toFixed(1)}, {loc.y_position.toFixed(1)}</span>
                            </div>

                            {loc.description && (
                                <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">
                                    {loc.description}
                                </p>
                            )}

                            {!loc.description && <div className="h-10 mb-6" />}

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/admin/map/${loc.id}`}
                                    className="text-blue-500 hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-2"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </Link>
                                <DeleteMapLocationButton locationId={loc.id} locationName={loc.name} />
                            </div>
                        </div>
                    ))}

                    {(!locations || locations.length === 0) && (
                        <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-white/10 rounded-3xl">
                            <p>No map locations found.</p>
                            <p className="text-sm mt-2">Create one to see it on the map.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
