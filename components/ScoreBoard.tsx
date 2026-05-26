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
    <div
      className="grid gap-1.5 sm:gap-2"
      style={{
        gridTemplateColumns: `repeat(${Math.max(participants.length, 1)}, minmax(0, 1fr))`,
      }}
    >
      {participants.map((participant, index) => {
        const active = index === currentTurnIndex;
        const Icon = participant.isComputer ? Bot : UserRound;

        return (
          <div
            key={participant.id}
            className={clsx(
              "min-w-0 rounded-lg border px-2 py-1.5 transition sm:px-2.5 sm:py-2",
              active ? "border-cyan-300 bg-cyan-300/18" : "border-white/12 bg-black/18",
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              <Icon className={clsx("size-3.5 shrink-0", active ? "text-cyan-200" : "text-slate-400")} />
              <p className="truncate text-[0.72rem] font-bold text-white">{participant.name}</p>
            </div>
            <p className="mt-0.5 text-base font-black leading-none text-white sm:mt-1 sm:text-lg">
              {participant.score}
            </p>
          </div>
        );
      })}
    </div>
  );
}
