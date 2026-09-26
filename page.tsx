"use client";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { ChoiceCard } from "@/components/questionnaire/ChoiceCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Equipment } from "@/lib/recommendation";

const ITEMS: { key: Equipment;label: string } [] = [
  { key: "none", label: "Nothing" },
  { key: "football", label: "Football" },
  { key: "cones", label: "Cones" },
  { key: "wall", label: "Wall" },
  { key: "goal", label: "Goal" },
  { key: "agility ladder", label: "Agility ladder" },
  { key: "jump rope", label: "Jump rope" },
  { key: "resistance bands", label: "Resistance bands" },
  { key: "weights", label: "Weights" },
  { key: "training partner", label: "Training partner" },
];

export default function EquipmentPage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();
  const selected = state.draft.equipment ?? [];
  
  function toggle(key: Equipment) {
    if (key === "none") {
      dispatch({ type: "set", patch: { equipment: ["none"] } });
      return;
    }
    const withoutNone = selected.filter((e) => e !== "none");
    const next = withoutNone.includes(key) ?
      withoutNone.filter((e) => e !== key) :
      [...withoutNone, key];
    dispatch({ type: "set", patch: { equipment: next } });
  }
  
  return (
    <Screen
      title="What equipment do you have?"
      subtitle="Step 3 of 7 — pick everything you can use."
      footer={
        <button
          disabled={selected.length === 0}
          onClick={() => router.push("/questionnaire/space")}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-black disabled:opacity-40"
        >
          Continue
        </button>
      }
    >
      <ProgressBar current={3} total={7} />
      <div className="pt-4 space-y-3">
        {ITEMS.map((o) => (
          <ChoiceCard
            key={o.key}
            label={o.label}
            selected={selected.includes(o.key)}
            onClick={() => toggle(o.key)}
          />
        ))}
      </div>
    </Screen>
  );
}