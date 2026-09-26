"use client";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TrainingInputSchema } from "@/lib/validation/input";
import { recommend, type TrainingInput } from "@/lib/recommendation";

export default function SummaryPage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();
  const d = state.draft;
  
  const parse = TrainingInputSchema.safeParse(d);
  if (!parse.success) {
    return (
      <Screen title="Something's missing" subtitle="Please go back and complete every step.">
        <p className="text-sm text-red-400">{parse.error.issues.map((i) => i.path.join(".")).join(", ")}</p>
        <button className="mt-4 w-full rounded-2xl bg-white/5 px-5 py-4" onClick={() => router.push("/questionnaire/position")}>
          Start over
        </button>
      </Screen>
    );
  }
  
  function build() {
    const input = parse.data as TrainingInput;
    const result = recommend(input, { excludeIds: state.excludeIds });
    if (result.kind === "recommendation") {
      dispatch({ type: "setRecommendation", value: result });
      router.push("/session");
    } else {
      alert(result.reason);
    }
  }
  
  return (
    <Screen
      title="Your session summary"
      subtitle="Step 7 of 7"
      footer={
        <div className="space-y-3">
          <button onClick={build} className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-black">
            Build My Training Plan
          </button>
          <button onClick={() => router.back()} className="w-full rounded-2xl bg-white/5 px-5 py-4 text-base font-semibold">
            Back
          </button>
          <p className="text-center text-xs text-white/50">
            Want to improve your football career? Let's build your session.
          </p>
        </div>
      }
    >
      <ProgressBar current={7} total={7} />
      <Row label="Position" value={d.position ?? "—"} />
      <Row label="Duration" value={d.minutes ? `${d.minutes} minutes` : "—"} />
      <Row label="When" value={d.trainingPeriod ?? "—"} />
      <Row label="Frequency" value={d.frequency?.replace(/_/g, " ") ?? "—"} />
      <Row label="Equipment" value={d.equipment?.length ? d.equipment.join(", ") : "—"} />
      <Row label="Space" value={d.space ?? "—"} />
      <Row label="Focus" value={d.focus ?? "—"} />
      <Row label="Level" value={d.level ?? "—"} />
    </Screen>
  );
}

function Row({ label, value }: { label: string;value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm font-semibold capitalize">{value}</span>
    </div>
  );
}