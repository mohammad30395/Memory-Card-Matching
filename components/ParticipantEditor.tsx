"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, UserRound } from "lucide-react";
import Button from "./Button";
import { DEFAULT_MODE, ROUTES, STORAGE_KEYS } from "@/lib/constants";
import { getUserProfile, readStorage, writeStorage } from "@/lib/localStorage";
import { createDefaultParticipants } from "@/lib/gameLogic";
import type { GameModeSelection, Participant } from "@/lib/types";

export default function ParticipantEditor() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const mode = readStorage<GameModeSelection>(STORAGE_KEYS.mode, DEFAULT_MODE);
    const savedParticipants = readStorage<Participant[]>(STORAGE_KEYS.participants, []);
    const defaults = createDefaultParticipants(mode, getUserProfile());

    if (savedParticipants.length === mode.participantCount) {
      setParticipants(
        savedParticipants.map((participant, index) => ({
          ...participant,
          name:
            participant.isComputer === defaults[index]?.isComputer
              ? participant.name
              : defaults[index]?.name || participant.name,
          isComputer: defaults[index]?.isComputer ?? participant.isComputer,
          score: 0,
        })),
      );
      return;
    }

    setParticipants(defaults);
  }, []);

  function updateName(id: string, name: string) {
    setParticipants((current) =>
      current.map((participant) => (participant.id === id ? { ...participant, name } : participant)),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedParticipants = participants.map((participant, index) => ({
      ...participant,
      name: participant.name.trim() || `Participant ${index + 1}`,
      score: 0,
    }));

    writeStorage(STORAGE_KEYS.participants, normalizedParticipants);
    router.push(ROUTES.playgrounds);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto grid max-w-3xl gap-5">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Participants</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Name each seat</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
          Edit the names that will appear in the turn indicator, scoreboard, and leaderboard.
        </p>
      </div>

      <div className="glass-panel grid gap-3 rounded-2xl p-4 sm:p-6">
        {participants.map((participant, index) => {
          const Icon = participant.isComputer ? Bot : UserRound;

          return (
            <label key={participant.id} className="grid gap-2 rounded-xl border border-white/10 bg-white/6 p-3 text-sm font-semibold text-slate-200">
              <span className="flex items-center gap-2">
                <Icon className="size-4 text-cyan-200" />
                Seat {index + 1} {participant.isComputer ? "(Computer)" : "(Player)"}
              </span>
              <input
                required
                value={participant.name}
                onChange={(event) => updateName(participant.id, event.target.value)}
                className="min-h-11 rounded-lg border border-white/12 bg-slate-950/40 px-4 text-white outline-none transition focus:border-cyan-300"
              />
            </label>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button type="submit">Save and choose playground</Button>
      </div>
    </form>
  );
}
