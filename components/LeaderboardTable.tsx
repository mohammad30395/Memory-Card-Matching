"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Button from "./Button";
import { clearLeaderboardRecords, getLeaderboardRecords } from "@/lib/leaderboard";
import type { LeaderboardRecord } from "@/lib/types";

export default function LeaderboardTable() {
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);

  useEffect(() => {
    setRecords(getLeaderboardRecords());
  }, []);

  function clearRecords() {
    if (!window.confirm("Clear all leaderboard records from this device?")) {
      return;
    }

    clearLeaderboardRecords();
    setRecords([]);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Local records</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Leaderboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Results are stored in localStorage on this browser only, sorted with the latest game first.
          </p>
        </div>
        <Button variant="danger" onClick={clearRecords} disabled={records.length === 0}>
          <Trash2 className="size-4" />
          Clear
        </Button>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        {records.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-300">No completed games yet.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {records.map((record) => (
              <article key={record.id} className="grid gap-3 p-4 sm:grid-cols-[1.1fr_1fr_0.8fr] sm:items-center">
                <div>
                  <p className="text-lg font-black text-white">{record.winnerName}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    {record.mode} · {record.participantCount} participants · {record.difficultyTitle}
                  </p>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  {record.scores.map((score) => `${score.participantName}: ${score.score}`).join("  |  ")}
                </p>
                <div className="text-left text-sm text-slate-300 sm:text-right">
                  <p className="font-semibold text-white">{record.playgroundTitle}</p>
                  <p>{new Date(record.createdAt).toLocaleString()}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
