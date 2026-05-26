"use client";

import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import type { MemoryCard as MemoryCardType, Playground } from "@/lib/types";

type MemoryCardProps = {
  card: MemoryCardType;
  playground: Playground;
  disabled: boolean;
  onFlip: (cardId: string) => void;
};

export default function MemoryCard({ card, playground, disabled, onFlip }: MemoryCardProps) {
  const visible = card.isFlipped || card.isMatched;

  return (
    <button
      type="button"
      disabled={disabled || card.isMatched || card.isFlipped}
      onClick={() => onFlip(card.id)}
      aria-label={visible ? `Card ${card.symbol}` : "Face down card"}
      className={clsx(
        "card-shell size-full min-h-0 rounded-lg outline-none transition focus:ring-2 focus:ring-cyan-200 disabled:cursor-default",
        !disabled && !visible && "hover:-translate-y-0.5",
      )}
    >
      <span
        className={clsx(
          "card-inner relative block size-full rounded-lg transition duration-500",
          visible && "card-flipped",
        )}
      >
        <span
          className={clsx(
            "card-face absolute inset-0 grid place-items-center rounded-lg border border-white/18 bg-gradient-to-br shadow-lg shadow-black/25",
            playground.cardBackClassName,
          )}
        >
          <Sparkles className="size-[34%] text-white/85" />
        </span>
        <span className="card-face card-face-front absolute inset-0 grid place-items-center rounded-lg border border-white/30 bg-white text-[clamp(1.35rem,7vw,3.2rem)] text-slate-950 shadow-lg shadow-black/25">
          <span className={clsx("font-black leading-none", card.isMatched ? "scale-95 opacity-70" : "scale-100")}>
            {card.symbol}
          </span>
        </span>
      </span>
    </button>
  );
}
