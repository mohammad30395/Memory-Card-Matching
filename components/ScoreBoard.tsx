"use client";

import { Bot, UserRound } from "lucide-react";
import { clsx } from "clsx";
import type { Participant } from "@/lib/types";

type ScoreBoardProps = {
  participants: Participant[];
  currentTurnIndex: number;
};

export default function ScoreBoard({ participants, currentTurnIndex }: ScoreBoardProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {participants.map((participant, index) => {
        const active = index === currentTurnIndex;
        const Icon = participant.isComputer ? Bot : UserRound;

        return (
          <div
            key={participant.id}
            className={clsx(
              "min-w-0 rounded-lg border px-2.5 py-2 transition",
              active ? "border-cyan-300 bg-cyan-300/18" : "border-white/12 bg-black/18",
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              <Icon className={clsx("size-3.5 shrink-0", active ? "text-cyan-200" : "text-slate-400")} />
              <p className="truncate text-[0.72rem] font-bold text-white">{participant.name}</p>
            </div>
            <p className="mt-1 text-lg font-black leading-none text-white">{participant.score}</p>
          </div>
        );
      })}
    </div>
  );
}
