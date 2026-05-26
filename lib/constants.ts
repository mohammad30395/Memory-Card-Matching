import type {
  Difficulty,
  GameModeSelection,
  GameSettings,
  Playground,
  SymbolSet,
  UserProfile,
} from "./types";

export const ROUTES = {
  home: "/",
  play: "/play",
  mode: "/mode",
  participants: "/participants",
  playgrounds: "/playgrounds",
  game: "/game",
  settings: "/settings",
  leaderboard: "/leaderboard",
  rules: "/rules",
} as const;

export const STORAGE_KEYS = {
  user: "memoryGame_user",
  settings: "memoryGame_settings",
  mode: "memoryGame_mode",
  participants: "memoryGame_participants",
  playground: "memoryGame_playground",
  leaderboard: "memoryGame_leaderboard",
} as const;

export const DEFAULT_USER: UserProfile = {
  name: "",
  username: "",
};

export const DEFAULT_SETTINGS: GameSettings = {
  difficultyId: "medium",
  symbolSetId: "hands",
};

export const DEFAULT_MODE: GameModeSelection = {
  type: "players",
  participantCount: 2,
};

export const DIFFICULTIES: Difficulty[] = [
  {
    id: "easy",
    title: "Easy",
    description: "3 x 4 board, 6 pairs",
    rows: 3,
    columns: 4,
    pairs: 6,
  },
  {
    id: "medium",
    title: "Medium",
    description: "4 x 4 board, 8 pairs",
    rows: 4,
    columns: 4,
    pairs: 8,
  },
  {
    id: "hard",
    title: "Hard",
    description: "5 x 4 board, 10 pairs",
    rows: 4,
    columns: 5,
    pairs: 10,
  },
];

export const SYMBOL_SETS: SymbolSet[] = [
  {
    id: "hands",
    title: "Hand Signs",
    description: "Expressive gesture icons for fast visual matching.",
    symbols: ["👍", "✌️", "👌", "🤘", "👊", "👏", "🙌", "🤝", "🫶", "👋"],
  },
  {
    id: "runes",
    title: "Arcade Runes",
    description: "High-contrast symbols built for neon tables.",
    symbols: ["◆", "▲", "●", "■", "✦", "✺", "✚", "◇", "◈", "✹"],
  },
  {
    id: "gems",
    title: "Gem Set",
    description: "Bright collectible marks with a softer puzzle feel.",
    symbols: ["💎", "🔷", "🔶", "🟢", "🟣", "⭐", "🌙", "🔥", "⚡", "❄️"],
  },
];

export const PLAYGROUNDS: Playground[] = [
  {
    id: "classic",
    title: "Classic Table",
    description: "A calm felt table with crisp card contrast.",
    previewClassName: "from-emerald-900 via-teal-800 to-slate-950",
    gameClassName: "bg-[radial-gradient(circle_at_top,#1f8f67_0%,#0f3f3b_38%,#071512_100%)] text-white",
    cardBackClassName: "from-emerald-500 to-cyan-700",
    accentClassName: "text-emerald-200",
  },
  {
    id: "forest",
    title: "Forest",
    description: "Layered greens and warm highlights for relaxed play.",
    previewClassName: "from-lime-950 via-green-800 to-stone-950",
    gameClassName: "bg-[linear-gradient(145deg,#11281d_0%,#255334_52%,#0e1712_100%)] text-white",
    cardBackClassName: "from-lime-500 to-green-800",
    accentClassName: "text-lime-200",
  },
  {
    id: "neon",
    title: "Neon Arena",
    description: "Electric arcade lighting with punchy interactions.",
    previewClassName: "from-fuchsia-950 via-cyan-900 to-slate-950",
    gameClassName: "bg-[linear-gradient(135deg,#120a2d_0%,#072c43_48%,#24051f_100%)] text-white",
    cardBackClassName: "from-fuchsia-500 to-cyan-500",
    accentClassName: "text-cyan-200",
  },
  {
    id: "royal",
    title: "Royal Board",
    description: "Deep jewel tones with a polished tournament feel.",
    previewClassName: "from-indigo-950 via-violet-900 to-amber-900",
    gameClassName: "bg-[linear-gradient(140deg,#14113a_0%,#42256e_48%,#5a3a10_100%)] text-white",
    cardBackClassName: "from-violet-500 to-amber-500",
    accentClassName: "text-amber-200",
  },
  {
    id: "space",
    title: "Space Theme",
    description: "Dark cosmic depth with bright card surfaces.",
    previewClassName: "from-slate-950 via-blue-950 to-fuchsia-950",
    gameClassName: "bg-[radial-gradient(circle_at_50%_0%,#203a7a_0%,#14152e_45%,#050713_100%)] text-white",
    cardBackClassName: "from-blue-500 to-violet-700",
    accentClassName: "text-blue-200",
  },
  {
    id: "minimal",
    title: "Minimal Dark",
    description: "A quiet high-focus layout for repeated matches.",
    previewClassName: "from-zinc-950 via-neutral-800 to-stone-950",
    gameClassName: "bg-[linear-gradient(145deg,#080808_0%,#242424_58%,#111111_100%)] text-white",
    cardBackClassName: "from-zinc-600 to-neutral-900",
    accentClassName: "text-zinc-200",
  },
];
