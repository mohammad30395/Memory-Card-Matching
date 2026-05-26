export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 animated-grid">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(45,212,191,0.16),transparent_28%),radial-gradient(circle_at_80%_8%,rgba(251,146,60,0.14),transparent_26%),radial-gradient(circle_at_52%_88%,rgba(168,85,247,0.14),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/8 to-transparent" />
    </div>
  );
}
