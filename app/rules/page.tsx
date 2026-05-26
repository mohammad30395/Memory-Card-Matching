import { Bot, ListOrdered, RotateCcw, Trophy, UsersRound } from "lucide-react";
import PageFrame from "@/components/PageFrame";

const rules = [
  {
    title: "How to play",
    icon: RotateCcw,
    text: "Cards begin face down. On each turn, flip two cards and try to reveal a matching pair.",
  },
  {
    title: "Turns",
    icon: UsersRound,
    text: "A successful match scores a point and the same participant keeps playing. A missed pair flips back and the turn moves forward.",
  },
  {
    title: "Scoring",
    icon: Trophy,
    text: "Each matched pair is worth one point. When no pairs remain, the highest score wins. Ties are recorded together.",
  },
  {
    title: "Player and computer mode",
    icon: Bot,
    text: "Players mode is shared-device multiplayer. Computer mode keeps the first participant as the user and lets simple computer players choose random valid cards.",
  },
  {
    title: "Leaderboard",
    icon: ListOrdered,
    text: "Completed game records are saved in localStorage on this browser only. The leaderboard shows the latest games first and can be cleared.",
  },
];

export default function RulesPage() {
  return (
    <PageFrame>
      <div className="mx-auto grid max-w-4xl gap-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Rules</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Memory Match Guide</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            A quick reference for turns, scoring, computer participants, and local records.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {rules.map((rule) => {
            const Icon = rule.icon;

            return (
              <article key={rule.title} className="glass-panel rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-300 text-slate-950">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-black text-white">{rule.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{rule.text}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PageFrame>
  );
}
