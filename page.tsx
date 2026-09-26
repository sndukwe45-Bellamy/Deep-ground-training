"use client";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { ChoiceCard } from "@/components/questionnaire/ChoiceCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Level } from "@/lib/recommendation";

const OPTIONS: { key: Level;label: string;description: string } [] = [
  { key: "beginner", label: "Beginner", description: "New to structured training" },
  { key: "intermediate", label: "Intermediate", description: "Training regularly" },
  { key: "advanced", label: "Advanced", description: "Competitive / high intensity" },
];

export default function LevelPage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();
  const selected = state.draft.level;
  
  return (
    <Screen
      title="What's your level?"
      subtitle="Step 6 of 7"
      footer={
        <button
          disabled={!selected}
          onClick={() => router.push("/questionnaire/summary")}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-black disabled:opacity-40"
        >
          Continue
        </button>
      }
    >
      <ProgressBar current={6} total={7} />
      <div className="pt-4 space-y-3">
        {OPTIONS.map((o) => (
          <ChoiceCard key={o.key} label={o.label} description={o.description} selected={selected === o.key} onClick={() => dispatch({ type: "set", patch: { level: o.key } })} />
        ))}
      </div>
    </Screen>
  );
}