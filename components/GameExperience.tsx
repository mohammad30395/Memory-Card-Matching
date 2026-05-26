"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Home, ListOrdered, RotateCcw, Settings2 } from "lucide-react";
import { clsx } from "clsx";
import Button from "./Button";
import MemoryBoard from "./MemoryBoard";
import ScoreBoard from "./ScoreBoard";
import TurnIndicator from "./TurnIndicator";
import { DEFAULT_MODE, ROUTES, STORAGE_KEYS } from "@/lib/constants";
import {
  calculateWinners,
  createDeck,
  createDefaultParticipants,
  getDifficulty,
  getNextTurnIndex,
  getPlayground,
  getSymbolSet,
  pickComputerCardIds,
  resetParticipantScores,
} from "@/lib/gameLogic";
import { appendLeaderboardRecord } from "@/lib/leaderboard";
import { getGameSettings, getUserProfile, readStorage } from "@/lib/localStorage";
import type {
  Difficulty,
  GameModeSelection,
  LeaderboardRecord,
  MemoryCard,
  Participant,
  Playground,
  PlaygroundId,
  SymbolSet,
} from "@/lib/types";

type GameConfig = {
  mode: GameModeSelection;
  difficulty: Difficulty;
  playground: Playground;
  symbolSet: SymbolSet;
};

function buildGameConfig(): GameConfig {
  const settings = getGameSettings();
  const mode = readStorage<GameModeSelection>(STORAGE_KEYS.mode, DEFAULT_MODE);
  const playgroundId = readStorage<PlaygroundId>(STORAGE_KEYS.playground, "classic");

  return {
    mode,
    difficulty: getDifficulty(settings.difficultyId),
    playground: getPlayground(playgroundId),
    symbolSet: getSymbolSet(settings.symbolSetId),
  };
}

export default function GameExperience() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [remainingPairs, setRemainingPairs] = useState(0);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [completedRecord, setCompletedRecord] = useState<LeaderboardRecord | null>(null);

  const cardsRef = useRef<MemoryCard[]>([]);
  const participantsRef = useRef<Participant[]>([]);
  const currentTurnIndexRef = useRef(0);
  const remainingPairsRef = useRef(0);
  const selectedCardIdsRef = useRef<string[]>([]);
  const isResolvingRef = useRef(false);
  const completedRecordRef = useRef<LeaderboardRecord | null>(null);
  const computerMoveIdRef = useRef(0);
  const configRef = useRef<GameConfig | null>(null);

  const syncCards = (nextCards: MemoryCard[]) => {
    cardsRef.current = nextCards;
    setCards(nextCards);
  };

  const syncParticipants = (nextParticipants: Participant[]) => {
    participantsRef.current = nextParticipants;
    setParticipants(nextParticipants);
  };

  const syncTurn = (nextTurnIndex: number) => {
    currentTurnIndexRef.current = nextTurnIndex;
    setCurrentTurnIndex(nextTurnIndex);
  };

  const syncRemainingPairs = (nextRemainingPairs: number) => {
    remainingPairsRef.current = nextRemainingPairs;
    setRemainingPairs(nextRemainingPairs);
  };

  const syncSelectedCardIds = (nextSelectedCardIds: string[]) => {
    selectedCardIdsRef.current = nextSelectedCardIds;
    setSelectedCardIds(nextSelectedCardIds);
  };

  const syncResolving = (nextIsResolving: boolean) => {
    isResolvingRef.current = nextIsResolving;
    setIsResolving(nextIsResolving);
  };

  const finishGame = useCallback((finalParticipants: Participant[]) => {
    const activeConfig = configRef.current;
    if (!activeConfig || completedRecordRef.current) {
      return;
    }

    const winners = calculateWinners(finalParticipants);
    const record: LeaderboardRecord = {
      id: crypto.randomUUID(),
      winnerName: winners.map((winner) => winner.name).join(" & "),
      mode: activeConfig.mode.type,
      participantCount: activeConfig.mode.participantCount,
      scores: finalParticipants.map((participant) => ({
        participantName: participant.name,
        score: participant.score,
        isComputer: participant.isComputer,
      })),
      playgroundId: activeConfig.playground.id,
      playgroundTitle: activeConfig.playground.title,
      difficultyId: activeConfig.difficulty.id,
      difficultyTitle: activeConfig.difficulty.title,
      symbolSetId: activeConfig.symbolSet.id,
      createdAt: new Date().toISOString(),
    };

    appendLeaderboardRecord(record);
    completedRecordRef.current = record;
    setCompletedRecord(record);
  }, []);

  const startNewGame = useCallback(() => {
    const nextConfig = buildGameConfig();
    const storedParticipants = readStorage<Participant[]>(STORAGE_KEYS.participants, []);
    const fallbackParticipants = createDefaultParticipants(nextConfig.mode, getUserProfile());
    const validParticipants =
      storedParticipants.length === nextConfig.mode.participantCount
        ? storedParticipants.map((participant, index) => ({
            ...participant,
            name:
              participant.isComputer === fallbackParticipants[index]?.isComputer
                ? participant.name
                : fallbackParticipants[index]?.name || participant.name,
            isComputer: fallbackParticipants[index]?.isComputer ?? participant.isComputer,
          }))
        : fallbackParticipants;

    configRef.current = nextConfig;
    setConfig(nextConfig);
    syncCards(createDeck(nextConfig.difficulty, nextConfig.symbolSet));
    syncParticipants(resetParticipantScores(validParticipants));
    syncTurn(0);
    syncRemainingPairs(nextConfig.difficulty.pairs);
    syncSelectedCardIds([]);
    syncResolving(false);
    completedRecordRef.current = null;
    setCompletedRecord(null);
    computerMoveIdRef.current += 1;
  }, []);

  const resolvePair = useCallback(
    (pairCardIds: string[]) => {
      const [firstCardId, secondCardId] = pairCardIds;
      const firstCard = cardsRef.current.find((card) => card.id === firstCardId);
      const secondCard = cardsRef.current.find((card) => card.id === secondCardId);

      if (!firstCard || !secondCard) {
        syncSelectedCardIds([]);
        syncResolving(false);
        return;
      }

      const matched = firstCard.pairId === secondCard.pairId;
      let nextParticipants = participantsRef.current;
      let nextRemainingPairs = remainingPairsRef.current;
      let nextTurnIndex = currentTurnIndexRef.current;

      const nextCards = cardsRef.current.map((card) => {
        if (card.id !== firstCardId && card.id !== secondCardId) {
          return card;
        }

        return matched
          ? { ...card, isMatched: true, isFlipped: true }
          : { ...card, isFlipped: false };
      });

      if (matched) {
        nextParticipants = participantsRef.current.map((participant, index) =>
          index === currentTurnIndexRef.current
            ? { ...participant, score: participant.score + 1 }
            : participant,
        );
        nextRemainingPairs -= 1;
      } else {
        nextTurnIndex = getNextTurnIndex(currentTurnIndexRef.current, participantsRef.current.length);
      }

      syncCards(nextCards);
      syncParticipants(nextParticipants);
      syncTurn(nextTurnIndex);
      syncRemainingPairs(nextRemainingPairs);
      syncSelectedCardIds([]);
      syncResolving(false);

      if (nextRemainingPairs === 0) {
        finishGame(nextParticipants);
      }
    },
    [finishGame],
  );

  const selectCard = useCallback(
    (cardId: string, automated = false) => {
      const activeParticipant = participantsRef.current[currentTurnIndexRef.current];
      if (
        completedRecordRef.current ||
        isResolvingRef.current ||
        selectedCardIdsRef.current.length >= 2 ||
        (!automated && activeParticipant?.isComputer)
      ) {
        return;
      }

      const targetCard = cardsRef.current.find((card) => card.id === cardId);
      if (!targetCard || targetCard.isMatched || targetCard.isFlipped) {
        return;
      }

      const nextCards = cardsRef.current.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card,
      );
      const nextSelectedCardIds = [...selectedCardIdsRef.current, cardId];

      syncCards(nextCards);
      syncSelectedCardIds(nextSelectedCardIds);

      if (nextSelectedCardIds.length === 2) {
        syncResolving(true);
        window.setTimeout(() => resolvePair(nextSelectedCardIds), 780);
      }
    },
    [resolvePair],
  );

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const activeParticipant = participants[currentTurnIndex];
    if (
      !activeParticipant?.isComputer ||
      isResolving ||
      completedRecord ||
      selectedCardIdsRef.current.length > 0
    ) {
      return;
    }

    const moveId = computerMoveIdRef.current + 1;
    computerMoveIdRef.current = moveId;
    const pickedCards = pickComputerCardIds(cardsRef.current);
    if (!pickedCards) {
      return;
    }

    const firstTimer = window.setTimeout(() => {
      if (computerMoveIdRef.current === moveId) {
        selectCard(pickedCards[0], true);
      }
    }, 540);

    const secondTimer = window.setTimeout(() => {
      if (computerMoveIdRef.current === moveId) {
        selectCard(pickedCards[1], true);
      }
    }, 1120);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
    };
  }, [completedRecord, currentTurnIndex, isResolving, participants, selectCard]);

  if (!config) {
    return (
      <main className="grid h-dvh place-items-center bg-slate-950 text-white">
        <p className="text-sm font-semibold text-slate-300">Preparing board...</p>
      </main>
    );
  }

  const currentParticipant = participants[currentTurnIndex];
  const boardDisabled =
    Boolean(completedRecord) ||
    isResolving ||
    selectedCardIds.length >= 2 ||
    Boolean(currentParticipant?.isComputer);

  return (
    <main className={clsx("grid h-dvh w-full overflow-hidden", config.playground.gameClassName)}>
      <div className="flex h-dvh min-h-0 w-full max-w-full flex-col gap-1.5 overflow-hidden px-1.5 py-1.5 safe-bottom sm:gap-2 sm:px-4 sm:py-3">
        <header className="grid shrink-0 gap-1.5 sm:gap-2">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <Link
              href={ROUTES.home}
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/12 bg-black/20 transition hover:bg-white/10 sm:size-10"
              title="Home"
            >
              <Home className="size-4" />
            </Link>
            <div className="min-w-0 text-center">
              <p className={clsx("truncate text-xs font-black sm:text-base", config.playground.accentClassName)}>
                {config.playground.title} · {config.difficulty.title}
              </p>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/60 sm:text-[0.68rem] sm:tracking-[0.18em]">
                {config.mode.type} mode
              </p>
            </div>
            <button
              type="button"
              onClick={startNewGame}
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/12 bg-black/20 transition hover:bg-white/10 sm:size-10"
              title="Restart"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(180px,0.7fr)_1fr] sm:items-center">
            <TurnIndicator
              participant={currentParticipant}
              remainingPairs={remainingPairs}
              isResolving={isResolving}
            />
            <ScoreBoard participants={participants} currentTurnIndex={currentTurnIndex} />
          </div>
        </header>

        <section className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/18 p-1.5 shadow-2xl shadow-black/25 sm:p-3">
          <MemoryBoard
            cards={cards}
            difficulty={config.difficulty}
            playground={config.playground}
            disabled={boardDisabled}
            onFlip={selectCard}
          />

          {completedRecord && (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-slate-950/76 p-4 backdrop-blur-md">
              <div className="glass-panel grid w-full max-w-md gap-4 rounded-2xl p-5 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">Game complete</p>
                <h1 className="text-3xl font-black text-white">{completedRecord.winnerName} wins</h1>
                <p className="text-sm leading-6 text-slate-300">
                  Scores saved to the local leaderboard for this browser.
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button onClick={startNewGame}>
                    <RotateCcw className="size-4" />
                    Replay
                  </Button>
                  <Button href={ROUTES.playgrounds} variant="secondary">
                    <Settings2 className="size-4" />
                    Setup
                  </Button>
                  <Button href={ROUTES.leaderboard} variant="secondary">
                    <ListOrdered className="size-4" />
                    Records
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
