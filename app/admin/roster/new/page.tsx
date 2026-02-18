import AdminNav from "@/components/layout/admin-nav";
import RosterForm from "@/components/admin/roster-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewMemberPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminNav />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link href="/admin/roster" className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Roster
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter text-white">
                        Add New Member
                    </h1>
                    <p className="text-slate-400">
                        Create a new member profile for the organization structure.
                    </p>
                </div>

                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8">
                    <RosterForm />
                </div>
            </main>
        </div>
    );
}
