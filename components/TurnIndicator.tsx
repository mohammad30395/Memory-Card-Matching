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
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/12 bg-black/20 px-2.5 py-1.5 sm:px-3 sm:py-2">
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white/10 sm:size-8">
        <Icon className="size-3.5 text-cyan-200 sm:size-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-black text-white sm:text-sm">{participant.name}&apos;s turn</p>
        <p className="text-[0.72rem] font-semibold text-slate-300">
          {isResolving ? "Checking pair" : `${remainingPairs} pairs left`}
        </p>
      </div>
    </div>
  );
}
