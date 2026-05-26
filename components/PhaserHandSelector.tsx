"use client";

import { useEffect, useRef } from "react";
import { SYMBOL_SETS } from "@/lib/constants";
import type { SymbolSetId } from "@/lib/types";

type PhaserHandSelectorProps = {
  selectedSymbolSetId: SymbolSetId;
  onSelect: (symbolSetId: SymbolSetId) => void;
};

export default function PhaserHandSelector({ selectedSymbolSetId, onSelect }: PhaserHandSelectorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef(selectedSymbolSetId);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    selectedRef.current = selectedSymbolSetId;
    onSelectRef.current = onSelect;
  }, [selectedSymbolSetId, onSelect]);

  useEffect(() => {
    let game: import("phaser").Game | null = null;
    let observer: ResizeObserver | null = null;
    let destroyed = false;

    async function createGame() {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const Phaser = await import("phaser");
      if (destroyed || !containerRef.current) {
        return;
      }

      const mount = containerRef.current;

      const build = () => {
        game?.destroy(true);

        const width = Math.max(280, Math.floor(mount.clientWidth));
        const height = 230;

        class SelectorScene extends Phaser.Scene {
          create() {
            const centerY = height / 2 + 12;
            const columnWidth = width / SYMBOL_SETS.length;

            this.add
              .text(width / 2, 22, "Choose card symbols", {
                color: "#e0faff",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
                fontStyle: "700",
              })
              .setOrigin(0.5);

            SYMBOL_SETS.forEach((symbolSet, index) => {
              const x = columnWidth * index + columnWidth / 2;
              const selected = symbolSet.id === selectedRef.current;
              const radius = Math.min(44, columnWidth * 0.28);
              const color = selected ? 0x67e8f9 : 0x1f2937;
              const stroke = selected ? 0xf8fafc : 0x64748b;

              const circle = this.add.circle(x, centerY - 12, radius, color, selected ? 0.92 : 0.74);
              circle.setStrokeStyle(3, stroke, selected ? 0.95 : 0.55);
              circle.setInteractive({ useHandCursor: true });

              const symbol = this.add
                .text(x, centerY - 22, symbolSet.symbols[0], {
                  color: selected ? "#08111f" : "#ffffff",
                  fontFamily: "Arial, sans-serif",
                  fontSize: `${Math.max(26, radius * 0.76)}px`,
                })
                .setOrigin(0.5);

              const label = this.add
                .text(x, centerY + radius + 18, symbolSet.title, {
                  color: selected ? "#ffffff" : "#cbd5e1",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "13px",
                  fontStyle: "700",
                })
                .setOrigin(0.5);

              const select = () => onSelectRef.current(symbolSet.id);
              circle.on("pointerdown", select);
              symbol.setInteractive({ useHandCursor: true }).on("pointerdown", select);
              label.setInteractive({ useHandCursor: true }).on("pointerdown", select);

              this.tweens.add({
                targets: [circle, symbol],
                y: "-=6",
                duration: 1100 + index * 130,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
              });
            });
          }
        }

        game = new Phaser.Game({
          type: Phaser.AUTO,
          parent: mount,
          width,
          height,
          transparent: true,
          backgroundColor: "rgba(0,0,0,0)",
          scene: SelectorScene,
          scale: {
            mode: Phaser.Scale.NONE,
          },
        });
      };

      build();
      observer = new ResizeObserver(build);
      observer.observe(mount);
    }

    createGame();

    return () => {
      destroyed = true;
      observer?.disconnect();
      game?.destroy(true);
    };
  }, [selectedSymbolSetId]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-slate-950/42">
      <div ref={containerRef} className="h-[230px] w-full" />
    </div>
  );
}
