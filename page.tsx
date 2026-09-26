"use client";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { ChoiceCard } from "@/components/questionnaire/ChoiceCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Minutes } from "@/lib/recommendation";

const DURATIONS: { key: Minutes; label: string }[] = [
  { key: 15, label: "15 minutes" },
  { key: 30, label: "30 minutes" },
  { key: 45, label: "45 minutes" },
  { key: 60, label: "60+ minutes" },
  { key: 90, label: "90 minutes" },
];

const PERIODS = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "night", label: "Night" },
] as const;

const FREQ = [
  { key: "1_day", label: "1 day/week" },
  { key: "2_3_days", label: "2–3 days/week" },
  { key: "4_5_days", label: "4–5 days/week" },
  { key: "almost_daily", label: "Almost every day" },
] as const;

export default function TimePage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();
  const d = state.draft;

  return (
    <Screen
      title="How long can you train?"
      subtitle="Step 2 of 7"
      footer={
        <button
          disabled={!d.minutes || !d.trainingPeriod || !d.frequency}
          onClick={() => router.push("/questionnaire/equipment")}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-black disabled:opacity-40"
        >
          Continue
        </button>
      }
    >
      <ProgressBar current={2} total={7} />
      <div className="pt-4 space-y-2">
        <div className="text-sm font-semibold text-white/70">Duration</div>
        {DURATIONS.map((o) => (
          <ChoiceCard key={o.key} label={o.label} selected={d.minutes === o.key} onClick={() => dispatch({ type: "set", patch: { minutes: o.key } })} />
        ))}
      </div>
      <div className="pt-4 space-y-2">
        <div className="text-sm font-semibold text-white/70">When do you usually train?</div>
        {PERIODS.map((o) => (
          <ChoiceCard key={o.key} label={o.label} selected={d.trainingPeriod === o.key} onClick={() => dispatch({ type: "set", patch: { trainingPeriod: o.key } })} />
        ))}
      </div>
      <div className="pt-4 space-y-2">
        <div className="text-sm font-semibold text-white/70">How often?</div>
        {FREQ.map((o) => (
          <ChoiceCard key={o.key} label={o.label} selected={d.frequency === o.key} onClick={() => dispatch({ type: "set", patch: { frequency: o.key } })} />
        ))}
      </div>
    </Screen>
  );
}