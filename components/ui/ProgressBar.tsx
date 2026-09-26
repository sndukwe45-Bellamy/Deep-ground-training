export function ProgressBar({ current, total }: { current: number;total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
