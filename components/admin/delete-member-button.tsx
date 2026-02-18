"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeleteMemberButtonProps {
    memberId: string;
    memberName: string;
}

export default function DeleteMemberButton({ memberId, memberName }: DeleteMemberButtonProps) {
    const router = useRouter();
    const supabase = createClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const { error } = await supabase
                .from('roster')
                .delete()
                .eq('id', memberId);

            if (error) throw error;

            router.push('/admin/roster');
            router.refresh();
        } catch (error) {
            console.error("Error deleting member:", error);
            alert("Failed to delete member.");
            setIsDeleting(false);
        }
    };

    if (confirming) {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
                <span className="text-sm text-red-400 font-bold">Are you sure?</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    disabled={isDeleting}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-red-500/20"
        >
            <Trash2 className="w-5 h-5" />
            <span className="font-bold">Delete Member</span>
        </button>
    );
}
