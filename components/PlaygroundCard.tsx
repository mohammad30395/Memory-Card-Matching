"use client";

import { Check } from "lucide-react";
import { clsx } from "clsx";
import type { Playground } from "@/lib/types";

type PlaygroundCardProps = {
  playground: Playground;
  selected: boolean;
  onSelect: (playground: Playground) => void;
};

export default function PlaygroundCard({ playground, selected, onSelect }: PlaygroundCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(playground)}
      className={clsx(
        "group overflow-hidden rounded-2xl border text-left transition duration-200 hover:-translate-y-1",
        selected ? "border-cyan-300 bg-cyan-300/12" : "border-white/12 bg-white/7 hover:bg-white/10",
      )}
    >
      <div className={clsx("h-28 bg-gradient-to-br", playground.previewClassName)}>
        <div className="grid h-full grid-cols-4 gap-2 p-4 opacity-90">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="rounded-md border border-white/20 bg-white/15 shadow-lg shadow-black/20" />
          ))}
        </div>
      </div>
      <div className="grid gap-3 p-4">
        <span className="flex items-center justify-between gap-3">
          <span className="text-lg font-black text-white">{playground.title}</span>
          {selected && <Check className="size-5 text-cyan-200" />}
        </span>
        <span className="text-sm leading-6 text-slate-300">{playground.description}</span>
        <span className={clsx("rounded-lg px-4 py-2 text-center text-sm font-bold transition", selected ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white group-hover:bg-white/16")}>
          {selected ? "Selected" : "Select"}
        </span>
      </div>
    </button>
  );
}
