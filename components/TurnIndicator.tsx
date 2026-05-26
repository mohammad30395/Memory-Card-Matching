"use client";

import { Bot, MousePointerClick } from "lucide-react";
import type { Participant } from "@/lib/types";

type TurnIndicatorProps = {
  participant?: Participant;
  remainingPairs: number;
  isResolving: boolean;
};

export default function TurnIndicator({ participant, remainingPairs, isResolving }: TurnIndicatorProps) {
  if (!participant) {
    return null;
  }

  const Icon = participant.isComputer ? Bot : MousePointerClick;

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/12 bg-black/20 px-3 py-2">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/10">
        <Icon className="size-4 text-cyan-200" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-white">{participant.name}&apos;s turn</p>
        <p className="text-[0.72rem] font-semibold text-slate-300">
          {isResolving ? "Checking pair" : `${remainingPairs} pairs left`}
        </p>
      </div>
    </div>
  );
}
