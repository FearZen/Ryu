import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import AdminNav from "@/components/layout/admin-nav";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function RosterManagePage() {
    const supabase = await createClient();

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Fetch Roster Data
    const { data: members, error } = await supabase
        .from('roster')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/admin/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-black tracking-tighter text-white">
                            Structure / Roster
                        </h1>
                        <p className="text-slate-400">
                            Manage organization members and hierarchy.
                        </p>
                    </div>
                    <Link
                        href="/admin/roster/new"
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Member
                    </Link>
                </div>

                {/* Content */}
                {members && members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map((member) => (
                            <div key={member.id} className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 group hover:border-green-500/30 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden relative border border-white/10">
                                            {member.avatar_url ? (
                                                <Image
                                                    src={member.avatar_url}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xl">
                                                    {member.name[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-white leading-tight">{member.name}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {member.ranks && member.ranks.map((rank: string, idx: number) => (
                                                    <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-white/5">
                                                        {rank}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className={`text-sm px-2 py-1 rounded-lg ${member.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                                            member.status === 'Inactive' ? 'bg-red-500/10 text-red-400' :
                                                'bg-slate-700 text-slate-300'
                                        }`}>
                                        {member.status}
                                    </span>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/roster/${member.id}`}
                                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5 border-dashed">
                        <p className="text-slate-500 text-lg mb-4">No members found.</p>
                        <Link
                            href="/admin/roster/new"
                            className="text-green-400 hover:text-green-300 font-bold"
                        >
                            Create your first member
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
