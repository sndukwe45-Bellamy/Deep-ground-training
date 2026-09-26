"use client";

export function ChoiceCard({
  label, selected, onClick, description,
}: { label: string; selected?: boolean; onClick: () => void; description?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="text-base font-semibold">{label}</div>
      {description && <div className="mt-1 text-sm text-white/60">{description}</div>}
    </button>
  );
}