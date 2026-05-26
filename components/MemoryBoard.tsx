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
      className="mx-auto grid size-full min-h-0 max-w-[820px] gap-1.5 sm:gap-2"
      style={{
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
