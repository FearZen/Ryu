import AnimatedHierarchy from "@/components/features/animated-hierarchy";
import { createClient } from "@/lib/supabase/server";
import SmartBackButton from "@/components/ui/smart-back-button";

export const revalidate = 0 // Ensure fresh data on every request

export default async function HierarchyPage() {
    const supabase = await createClient()

    // Fetch all roster members
    // Note: The component handles filtering by rank categories locally from this full list
    const { data: roster } = await supabase
        .from('roster')
        .select('*')
        .order('created_at', { ascending: true })

    return (
        <div className="min-h-screen bg-black text-white relative">

            {/* Ambient Background Grid */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />

            <div className="relative z-30 pt-24 px-4 max-w-7xl mx-auto">
                <SmartBackButton />
            </div>

            <div className="-mt-16">
                <AnimatedHierarchy initialRoster={roster || []} />
            </div>
        </div>
    )
}
