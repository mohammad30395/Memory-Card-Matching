"use client";

import dynamic from "next/dynamic";
import { ListOrdered, Play, ScrollText, Settings } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { ROUTES } from "@/lib/constants";

const ThreeMemoryCards = dynamic(() => import("@/components/ThreeMemoryCards"), {
  ssr: false,
  loading: () => <div className="h-[280px] w-full rounded-2xl bg-white/6 sm:h-[360px]" />,
});

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <AnimatedBackground />
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100dvh-65px)] max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-200">Local multiplayer puzzle</p>
          <div className="grid gap-4">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] text-white sm:text-7xl">
              Memory Match Arena
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Flip cards, remember positions, and outscore friends or computer opponents across animated themed boards.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <Button href={ROUTES.play} className="col-span-2 sm:col-span-1">
              <Play className="size-4" />
              Play
            </Button>
            <Button href={ROUTES.rules} variant="secondary">
              <ScrollText className="size-4" />
              Rules
            </Button>
            <Button href={ROUTES.settings} variant="secondary">
              <Settings className="size-4" />
              Settings
            </Button>
            <Button href={ROUTES.leaderboard} variant="secondary">
              <ListOrdered className="size-4" />
              Leaderboard
            </Button>
          </div>
        </div>

        <div className="relative">
          <ThreeMemoryCards />
        </div>
      </section>
    </main>
  );
}
