'use client'

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { MapLocation } from "@/types";

const InteractiveMap = dynamic(
    () => import("./interactive-map"),
    {
        loading: () => (
            <div className="w-full h-full min-h-[600px] rounded-3xl bg-slate-900 flex items-center justify-center text-slate-500 border border-white/5">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span>Loading Satellite Data...</span>
                </div>
            </div>
        ),
        ssr: false
    }
);

export default function MapWrapper({ locations }: { locations: MapLocation[] }) {
    return <InteractiveMap locations={locations} />
}
