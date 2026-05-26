"use client";

import MemoryCard from "./MemoryCard";
import type { Difficulty, MemoryCard as MemoryCardType, Playground } from "@/lib/types";

type MemoryBoardProps = {
  cards: MemoryCardType[];
  difficulty: Difficulty;
  playground: Playground;
  disabled: boolean;
  onFlip: (cardId: string) => void;
};

export default function MemoryBoard({ cards, difficulty, playground, disabled, onFlip }: MemoryBoardProps) {
  return (
    <div
      className="mx-auto grid h-full min-h-0 max-h-full max-w-full justify-center gap-1.5 sm:gap-2"
      style={{
        aspectRatio: `${difficulty.columns * 3} / ${difficulty.rows * 4}`,
        maxWidth: "820px",
        gridTemplateColumns: `repeat(${difficulty.columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${difficulty.rows}, minmax(0, 1fr))`,
      }}
    >
      {cards.map((card) => (
        <MemoryCard key={card.id} card={card} playground={playground} disabled={disabled} onFlip={onFlip} />
      ))}
    </div>
  );
}
