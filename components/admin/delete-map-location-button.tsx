"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteMapLocationButtonProps {
    locationId: string;
    locationName: string;
}

export default function DeleteMapLocationButton({ locationId, locationName }: DeleteMapLocationButtonProps) {
    const router = useRouter();
    const supabase = createClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const { error } = await supabase
                .from('map_locations')
                .delete()
                .eq('id', locationId);

            if (error) throw error;

            router.refresh();
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("Failed to delete location.");
            setIsDeleting(false);
        } finally {
            // Optional: setIsDeleting(false) if not refreshing or if refresh is instant, 
            // but usually we want to keep it disabled until refresh completes
        }
    };

    if (confirming) {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
                <span className="text-xs text-red-400 font-bold">Sure?</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-xs font-bold transition-colors"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    disabled={isDeleting}
                    className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-xs transition-colors"
                >
                    X
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-2"
        >
            <Trash2 className="w-4 h-4" />
            Remove
        </button>
    );
}
