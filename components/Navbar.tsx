"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListOrdered, Play, Settings, ScrollText } from "lucide-react";
import { clsx } from "clsx";
import { ROUTES } from "@/lib/constants";

const navItems = [
  { href: ROUTES.home, label: "Home", icon: Home },
  { href: ROUTES.play, label: "Play", icon: Play },
  { href: ROUTES.rules, label: "Rules", icon: ScrollText },
  { href: ROUTES.settings, label: "Settings", icon: Settings },
  { href: ROUTES.leaderboard, label: "Leaderboard", icon: ListOrdered },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href={ROUTES.home} className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-cyan-300 text-slate-950">M</span>
          <span className="hidden sm:inline">Memory Arena</span>
        </Link>
        <div className="flex max-w-[68vw] items-center gap-1 overflow-x-auto rounded-lg border border-white/10 bg-white/5 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={clsx(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white",
                  active && "bg-cyan-300 text-slate-950 hover:bg-cyan-200 hover:text-slate-950",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
