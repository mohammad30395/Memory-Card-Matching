"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type SharedProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
};

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/80 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary" &&
      "bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/30 hover:-translate-y-0.5 hover:bg-white",
    variant === "secondary" &&
      "border border-white/15 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white/18",
    variant === "ghost" && "text-slate-200 hover:bg-white/10 hover:text-white",
    variant === "danger" &&
      "border border-rose-300/30 bg-rose-500/16 text-rose-100 hover:bg-rose-500/28",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
