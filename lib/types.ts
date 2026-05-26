export type GameModeType = "players" | "computer";

export type DifficultyId = "easy" | "medium" | "hard";

export type PlaygroundId =
  | "classic"
  | "forest"
  | "neon"
  | "royal"
  | "space"
  | "minimal";

export type SymbolSetId = "hands" | "runes" | "gems";

export interface UserProfile {
  name: string;
  username: string;
}

export interface GameSettings {
  user?: UserProfile;
  difficultyId: DifficultyId;
  symbolSetId: SymbolSetId;
}

export interface GameModeSelection {
  type: GameModeType;
  participantCount: 2 | 3 | 4;
}

export interface Participant {
  id: string;
  name: string;
  isComputer: boolean;
  score: number;
}

export interface Playground {
  id: PlaygroundId;
  title: string;
  description: string;
  previewClassName: string;
  gameClassName: string;
  cardBackClassName: string;
  accentClassName: string;
}

export interface Difficulty {
  id: DifficultyId;
  title: string;
  description: string;
  rows: number;
  columns: number;
  pairs: number;
}

export interface SymbolSet {
  id: SymbolSetId;
  title: string;
  description: string;
  symbols: string[];
}

export interface MemoryCard {
  id: string;
  pairId: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: MemoryCard[];
  participants: Participant[];
  currentTurnIndex: number;
  remainingPairs: number;
  selectedCardIds: string[];
  isResolving: boolean;
}

export interface LeaderboardRecord {
  id: string;
  winnerName: string;
  mode: GameModeType;
  participantCount: number;
  scores: Array<{
    participantName: string;
    score: number;
    isComputer: boolean;
  }>;
  playgroundId: PlaygroundId;
  playgroundTitle: string;
  difficultyId: DifficultyId;
  difficultyTitle: string;
  symbolSetId: SymbolSetId;
  createdAt: string;
}
