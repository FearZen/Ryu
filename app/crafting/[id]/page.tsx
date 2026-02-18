import { createClient } from "@/lib/supabase/server";
import CraftingCalculator from "@/components/features/crafting-calculator";
import { CraftingItem, Material } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export const revalidate = 60;

type Props = {
    params: Promise<{ id: string }>;
};

export default async function CraftingDetailPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Item
    const { data: item } = await supabase
        .from("crafting_items")
        .select("*")
        .eq("id", id)
        .single();

    if (!item) {
        notFound();
    }

    // Fetch Materials
    const { data: materials } = await supabase
        .from("materials")
        .select("*")
        .eq("crafting_item_id", id);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Back Button */}
            <Link
                href="/crafting"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Blueprints
            </Link>

            {/* Header Section */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent pointer-events-none" />

                <div className="grid md:grid-cols-[300px_1fr] gap-8 p-8 relative z-10">
                    {/* Main Image */}
                    <div className="aspect-square rounded-2xl bg-black/50 border border-white/5 overflow-hidden shadow-2xl">
                        {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold">
                                NO IMAGE
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center space-y-4">
                        <div className="inline-flex">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                {item.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                            {item.name}
                        </h1>

                        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                            {item.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Calculator Section */}
            <div className="container mx-auto">
                <CraftingCalculator
                    item={item as CraftingItem}
                    materials={(materials as Material[]) || []}
                />
            </div>
        </div>
    );
}
