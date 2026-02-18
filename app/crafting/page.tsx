import { createClient } from "@/lib/supabase/server";
import CraftingList from "@/components/features/crafting-list";
import { CraftingItem } from "@/types";
import AccessGate from "@/components/features/access-gate";
import SmartBackButton from "@/components/ui/smart-back-button";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function CraftingPage() {
    const supabase = await createClient();
    const { data: items } = await supabase
        .from("crafting_items")
        .select("*")
        .order("name");

    return (
        <div className="space-y-8">
            <AccessGate>
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        CRAFTING <span className="text-blue-500">KNOWLEDGE</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl">
                        Complete database of blueprints, material requirements, and profit calculations for Ryu Faction members.
                    </p>
                    <div className="pt-4">
                        <SmartBackButton />
                    </div>
                </div>

                <CraftingList initialItems={(items as CraftingItem[]) || []} />
            </AccessGate>
        </div >
    );
}
