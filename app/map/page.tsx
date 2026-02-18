import { createClient } from "@/lib/supabase/server";
import { MapLocation } from "@/types";
import { Loader2 } from "lucide-react";

import MapWrapper from "@/components/features/map/map-wrapper";

export const revalidate = 60;

export default async function MapPage() {
    const supabase = await createClient();
    const { data: locations } = await supabase
        .from("map_locations")
        .select("*");

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    OPERATIONAL <span className="text-blue-500">MAP</span>
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    Live tracking of key locations, territories, and resource points.
                </p>
            </div>

            <div className="w-full h-[80vh] min-h-[600px] border-4 border-slate-900 rounded-3xl shadow-2xl bg-[#0fa8d2] overflow-hidden relative">
                <div className="absolute inset-0 z-0 bg-grid-slate-800/10" />
                <MapWrapper locations={(locations as MapLocation[]) || []} />
            </div>


        </div>
    );
}
