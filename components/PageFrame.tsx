import type { ReactNode } from "react";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";

type PageFrameProps = {
  children: ReactNode;
  compact?: boolean;
};

export default function PageFrame({ children, compact = false }: PageFrameProps) {
  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <AnimatedBackground />
      <Navbar />
      <section className={compact ? "mx-auto w-full max-w-6xl px-4 py-6" : "mx-auto w-full max-w-6xl px-4 py-8 sm:py-12"}>
        {children}
      </section>
    </main>
  );
}
