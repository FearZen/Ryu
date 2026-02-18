import AnimatedHierarchy from "@/components/features/animated-hierarchy";
import HeroSlider from "@/components/features/hero-slider";
import Link from "next/link";
import { ArrowRight, Hammer, Map, ShieldCheck } from "lucide-react";
import Image from "next/image";
import TikTokSection from "@/components/features/tiktok-section";
import { createClient } from "@/lib/supabase/server";
import Storyboard from "@/components/features/storyboard";
export default async function Home() {
  const supabase = await createClient();
  const { data: roster } = await supabase.from('roster').select('*').order('created_at', { ascending: true });
  const { data: stories } = await supabase.from('stories').select('*').order('created_at', { ascending: true });

  return (
    <div className="flex flex-col items-center gap-16 w-full relative">

      {/* Global Background (Refined) */}
      <div className="fixed inset-0 z-[-1] flex items-center justify-center overflow-hidden pointer-events-none">
        {/* The Dragon Image - Centered and 'Smaller' visually via containment and masking */}
        <div className="relative w-[120vw] h-[120vh] md:w-full md:h-full max-w-6xl max-h-[1000px]">
          <Image
            src="/ryunaga3.png"
            alt="Ryu Background"
            fill
            className="object-contain opacity-50 drop-shadow-[0_0_50px_rgba(59,130,246,0.6)]"
            priority
          />
        </div>

        {/* Heavy Vignette Mask to fade edges and focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#020617_80%)]" />

        {/* Blue Glow Overlay */}
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-screen" />
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center text-center overflow-hidden rounded-3xl border border-white/5 shadow-2xl isolate group bg-black/20 backdrop-blur-sm">
        <HeroSlider />

        <div className="relative z-20 space-y-8 px-4 max-w-5xl mx-auto flex flex-col items-center">
          <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <div className="inline-block px-6 py-2 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              Official Faction Portal
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-slate-400 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              RYU SIXNINE
            </h1>

            <p className="text-xl md:text-3xl text-slate-200 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Dominance. Respect. Loyalty. <br />
              <span className="text-blue-400 font-semibold drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">Welcome to Ryu petok petok.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-8 animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-300">

            <Link
              href="/map"
              className="px-10 py-5 bg-slate-900/60 hover:bg-slate-800/80 text-white border border-white/10 font-bold text-lg rounded-2xl transition-all hover:border-blue-500/50 backdrop-blur-xl flex items-center gap-3 group/btn hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <Map className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
              View Territory
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 drop-shadow-lg">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1 bg-black/20 backdrop-blur-sm">
            <div className="w-1 h-3 bg-slate-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Storyboard Section */}
      <Storyboard stories={stories || []} />

      {/* TikTok Profile Section */}
      <TikTokSection />

      {/* Hierarchy Section */}
      <AnimatedHierarchy initialRoster={roster || []} />


    </div>
  );
}
