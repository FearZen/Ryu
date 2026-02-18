import AdminNav from "@/components/layout/admin-nav";
import RosterForm from "@/components/admin/roster-form";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import DeleteMemberButton from "@/components/admin/delete-member-button";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: member, error } = await supabase
        .from('roster')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !member) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <Link href="/admin/roster" className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Roster
                        </Link>
                        <h1 className="text-3xl font-black tracking-tighter text-white">
                            Edit Member
                        </h1>
                        <p className="text-slate-400">
                            Update details for <span className="text-green-400 font-bold">{member.name}</span>.
                        </p>
                    </div>
                    <DeleteMemberButton memberId={member.id} memberName={member.name} />
                </div>

                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8">
                    <RosterForm initialData={member} isEditing />
                </div>
            </main>
        </div>
    );
}
