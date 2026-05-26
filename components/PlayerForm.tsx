"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import Button from "./Button";
import { ROUTES } from "@/lib/constants";
import { getUserProfile, saveUserProfile } from "@/lib/localStorage";

type PlayerFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  nextPath?: string;
};

export default function PlayerForm({
  title,
  description,
  submitLabel,
  nextPath = ROUTES.mode,
}: PlayerFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = getUserProfile();
    setName(user.name);
    setUsername(user.username);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    saveUserProfile({ name, username });
    setSaved(true);

    if (nextPath) {
      router.push(nextPath);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel mx-auto grid max-w-xl gap-5 rounded-2xl p-5 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-cyan-300 text-slate-950">
          <UserRound className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
        </div>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Name
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="min-h-12 rounded-lg border border-white/12 bg-white/8 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/12"
          placeholder="Enter your name"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Username
        <input
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="min-h-12 rounded-lg border border-white/12 bg-white/8 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/12"
          placeholder="Choose a username"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit">{submitLabel}</Button>
        {saved && <p className="text-sm font-semibold text-cyan-200">Saved locally on this device.</p>}
      </div>
    </form>
  );
}
