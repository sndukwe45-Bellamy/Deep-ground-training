"use client";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { ChoiceCard } from "@/components/questionnaire/ChoiceCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Focus } from "@/lib/recommendation";

const GROUPS: { title: string; items: { key: Focus; label: string }[] }[] = [
  {
    title: "Technical",
    items: [
      { key: "ball control", label: "Ball control" },
      { key: "first touch", label: "First touch" },
      { key: "dribbling", label: "Dribbling" },
      { key: "passing", label: "Passing" },
      { key: "weak foot", label: "Weak foot" },
      { key: "finishing", label: "Finishing" },
      { key: "shooting", label: "Shooting" },
      { key: "crossing", label: "Crossing" },
    ],
  },
  {
    title: "Physical",
    items: [
      { key: "speed", label: "Speed" },
      { key: "agility", label: "Agility" },
      { key: "stamina", label: "Stamina" },
      { key: "strength", label: "Strength" },
      { key: "mobility", label: "Mobility" },
    ],
  },
  {
    title: "Football IQ",
    items: [
      { key: "football iq", label: "Football IQ" },
    ],
  },
  {
    title: "Defending & Goalkeeping",
    items: [
      { key: "defending", label: "Defending" },
      { key: "goalkeeping", label: "Goalkeeping" },
    ],
  },
];

export default function GoalPage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();
  const selected = state.draft.focus;

  return (
    <Screen
      title="What do you want to develop?"
      subtitle="Step 5 of 7 — pick one primary focus."
      footer={
        <button
          disabled={!selected}
          onClick={() => router.push("/questionnaire/level")}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-black disabled:opacity-40"
        >
          Continue
        </button>
      }
    >
      <ProgressBar current={5} total={7} />
      {GROUPS.map((g) => (
        <div key={g.title} className="pt-3 space-y-2">
          <div className="text-sm font-semibold text-white/70">{g.title}</div>
          {g.items.map((o) => (
            <ChoiceCard key={o.key} label={o.label} selected={selected === o.key} onClick={() => dispatch({ type: "set", patch: { focus: o.key } })} />
          ))}
        </div>
      ))}
    </Screen>
  );
}