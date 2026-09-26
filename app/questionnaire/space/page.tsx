"use client";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { ChoiceCard } from "@/components/questionnaire/ChoiceCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Space } from "@/lib/recommendation";

const OPTIONS: { key: Space;label: string } [] = [
  { key: "small indoor", label: "Small indoor space" },
  { key: "small open area", label: "Small open area" },
  { key: "backyard", label: "Backyard" },
  { key: "pitch", label: "Football pitch" },
  { key: "gym", label: "Gym" },
];

export default function SpacePage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();
  const selected = state.draft.space;
  
  return (
    <Screen
      title="Where will you train?"
      subtitle="Step 4 of 7"
      footer={
        <button
          disabled={!selected}
          onClick={() => router.push("/questionnaire/goal")}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-black disabled:opacity-40"
        >
          Continue
        </button>
      }
    >
      <ProgressBar current={4} total={7} />
      <div className="pt-4 space-y-3">
        {OPTIONS.map((o) => (
          <ChoiceCard key={o.key} label={o.label} selected={selected === o.key} onClick={() => dispatch({ type: "set", patch: { space: o.key } })} />
        ))}
      </div>
    </Screen>
  );
}
