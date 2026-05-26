import { DIFFICULTIES, PLAYGROUNDS, SYMBOL_SETS } from "./constants";
import type {
  Difficulty,
  DifficultyId,
  GameModeSelection,
  MemoryCard,
  Participant,
  Playground,
  PlaygroundId,
  SymbolSet,
  SymbolSetId,
  UserProfile,
} from "./types";

export function getDifficulty(id: DifficultyId): Difficulty {
  return DIFFICULTIES.find((difficulty) => difficulty.id === id) ?? DIFFICULTIES[1];
}

export function getPlayground(id: PlaygroundId): Playground {
  return PLAYGROUNDS.find((playground) => playground.id === id) ?? PLAYGROUNDS[0];
}

export function getSymbolSet(id: SymbolSetId): SymbolSet {
  return SYMBOL_SETS.find((symbolSet) => symbolSet.id === id) ?? SYMBOL_SETS[0];
}

export function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function createDeck(difficulty: Difficulty, symbolSet: SymbolSet): MemoryCard[] {
  const symbols = symbolSet.symbols.slice(0, difficulty.pairs);
  const pairedCards = symbols.flatMap((symbol, index) => {
    const pairId = `${symbolSet.id}-${index}`;

    return [
      {
        id: `${pairId}-a-${crypto.randomUUID()}`,
        pairId,
        symbol,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `${pairId}-b-${crypto.randomUUID()}`,
        pairId,
        symbol,
        isFlipped: false,
        isMatched: false,
      },
    ];
  });

  return shuffleArray(pairedCards);
}

export function createDefaultParticipants(
  mode: GameModeSelection,
  user: UserProfile,
): Participant[] {
  return Array.from({ length: mode.participantCount }, (_, index) => {
    const participantNumber = index + 1;
    const isComputer = mode.type === "computer" && index > 0;
    const userName = user.name.trim() || user.username.trim() || "User";

    return {
      id: `participant-${participantNumber}`,
      name: isComputer
        ? `Computer ${index}`
        : mode.type === "computer" && index === 0
          ? userName
          : `Player ${participantNumber}`,
      isComputer,
      score: 0,
    };
  });
}

export function resetParticipantScores(participants: Participant[]): Participant[] {
  return participants.map((participant) => ({
    ...participant,
    score: 0,
  }));
}

export function getNextTurnIndex(currentTurnIndex: number, participantCount: number): number {
  return (currentTurnIndex + 1) % participantCount;
}

export function pickComputerCardIds(cards: MemoryCard[]): [string, string] | null {
  const availableCards = cards.filter((card) => !card.isMatched && !card.isFlipped);

  if (availableCards.length < 2) {
    return null;
  }

  const [firstCard, secondCard] = shuffleArray(availableCards).slice(0, 2);
  return [firstCard.id, secondCard.id];
}

export function calculateWinners(participants: Participant[]): Participant[] {
  const topScore = Math.max(...participants.map((participant) => participant.score));
  return participants.filter((participant) => participant.score === topScore);
}
