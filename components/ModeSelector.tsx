"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, UsersRound } from "lucide-react";
import { clsx } from "clsx";
import Button from "./Button";
import { DEFAULT_MODE, ROUTES, STORAGE_KEYS } from "@/lib/constants";
import { readStorage, writeStorage } from "@/lib/localStorage";
import type { GameModeSelection, GameModeType } from "@/lib/types";

const countOptions = [2, 3, 4] as const;

export default function ModeSelector() {
  const router = useRouter();
  const [selection, setSelection] = useState<GameModeSelection>(DEFAULT_MODE);

  useEffect(() => {
    setSelection(readStorage<GameModeSelection>(STORAGE_KEYS.mode, DEFAULT_MODE));
  }, []);

  function updateType(type: GameModeType) {
    setSelection((current) => ({ ...current, type }));
  }

  function continueSetup() {
    writeStorage(STORAGE_KEYS.mode, selection);
    router.push(ROUTES.participants);
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Match format</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Choose who plays</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          Pick local players for shared-device play or add computer participants for an automated challenge.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            type: "players" as const,
            title: "Players",
            description: "Two to four human participants take turns on the same screen.",
            icon: UsersRound,
          },
          {
            type: "computer" as const,
            title: "Computer",
            description: "You play against one, two, or three simple computer opponents.",
            icon: Bot,
          },
        ].map((option) => {
          const Icon = option.icon;
          const active = selection.type === option.type;

          return (
            <button
              key={option.type}
              type="button"
              onClick={() => updateType(option.type)}
              className={clsx(
                "glass-panel rounded-2xl p-5 text-left transition duration-200 hover:-translate-y-1",
                active ? "border-cyan-300/70 bg-cyan-300/12" : "hover:bg-white/10",
              )}
            >
              <div className="flex items-start gap-4">
                <span className={clsx("grid size-12 place-items-center rounded-xl", active ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white")}>
                  <Icon className="size-6" />
                </span>
                <span>
                  <span className="block text-xl font-black text-white">{option.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-slate-300">{option.description}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <h2 className="text-lg font-black text-white">
          {selection.type === "players" ? "Player count" : "Total participants"}
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          2 uses opposite sides, 3 positions participants around three sides, and 4 fills every side.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {countOptions.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setSelection((current) => ({ ...current, participantCount: count }))}
              className={clsx(
                "rounded-lg border px-4 py-4 text-center text-sm font-black transition",
                selection.participantCount === count
                  ? "border-cyan-300 bg-cyan-300 text-slate-950"
                  : "border-white/12 bg-white/8 text-white hover:bg-white/14",
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={continueSetup}>Continue</Button>
      </div>
    </div>
  );
}
