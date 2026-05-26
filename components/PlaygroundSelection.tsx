"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import Button from "./Button";
import PhaserHandSelector from "./PhaserHandSelector";
import PlaygroundCard from "./PlaygroundCard";
import { DEFAULT_SETTINGS, DIFFICULTIES, PLAYGROUNDS, ROUTES, STORAGE_KEYS } from "@/lib/constants";
import { getGameSettings, readStorage, saveGameSettings, writeStorage } from "@/lib/localStorage";
import type { DifficultyId, Playground, PlaygroundId, SymbolSetId } from "@/lib/types";

export default function PlaygroundSelection() {
  const router = useRouter();
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState<PlaygroundId>("classic");
  const [difficultyId, setDifficultyId] = useState<DifficultyId>(DEFAULT_SETTINGS.difficultyId);
  const [symbolSetId, setSymbolSetId] = useState<SymbolSetId>(DEFAULT_SETTINGS.symbolSetId);

  useEffect(() => {
    const settings = getGameSettings();
    setDifficultyId(settings.difficultyId);
    setSymbolSetId(settings.symbolSetId);
    setSelectedPlaygroundId(readStorage<PlaygroundId>(STORAGE_KEYS.playground, "classic"));
  }, []);

  function selectPlayground(playground: Playground) {
    setSelectedPlaygroundId(playground.id);
  }

  function startGame() {
    writeStorage(STORAGE_KEYS.playground, selectedPlaygroundId);
    saveGameSettings({ difficultyId, symbolSetId });
    router.push(ROUTES.game);
  }

  return (
    <div className="grid gap-8">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Board setup</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Choose the table</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          Pick a visual playground, difficulty, and card symbol set before starting the match.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {DIFFICULTIES.map((difficulty) => (
          <button
            key={difficulty.id}
            type="button"
            onClick={() => setDifficultyId(difficulty.id)}
            className={clsx(
              "rounded-2xl border p-4 text-left transition hover:-translate-y-1",
              difficultyId === difficulty.id
                ? "border-cyan-300 bg-cyan-300/14"
                : "border-white/12 bg-white/7 hover:bg-white/10",
            )}
          >
            <span className="text-xl font-black text-white">{difficulty.title}</span>
            <span className="mt-2 block text-sm text-slate-300">{difficulty.description}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYGROUNDS.map((playground) => (
            <PlaygroundCard
              key={playground.id}
              playground={playground}
              selected={playground.id === selectedPlaygroundId}
              onSelect={selectPlayground}
            />
          ))}
        </div>

        <div className="grid content-start gap-4">
          <div className="glass-panel rounded-2xl p-4">
            <h2 className="text-lg font-black text-white">Card symbols</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Choose the face set used for every matching pair.
            </p>
            <div className="mt-4">
              <PhaserHandSelector selectedSymbolSetId={symbolSetId} onSelect={setSymbolSetId} />
            </div>
          </div>
          <Button onClick={startGame} className="w-full">
            Start game
          </Button>
        </div>
      </div>
    </div>
  );
}
