"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { recommend, type TrainingInput } from "@/lib/recommendation";
import { TrainingInputSchema } from "@/lib/validation/input";

export default function SessionPage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();
  const rec = state.recommendation;
  
  if (!rec) {
    return (
      <Screen title="No session yet" subtitle="Complete the setup first.">
        <button onClick={() => router.push("/questionnaire/position")} className="w-full rounded-2xl bg-emerald-500 px-5 py-4 font-semibold text-black">
          Start setup
        </button>
      </Screen>
    );
  }
  
  function tryAnother() {
    const parse = TrainingInputSchema.safeParse(state.draft);
    if (!parse.success) return;
    const input = parse.data as TrainingInput;
    const used = [...state.excludeIds, ...rec.exercises.map((e) => e.id)];
    const next = recommend(input, { excludeIds: used });
    if (next.kind === "recommendation") {
      dispatch({ type: "setRecommendation", value: next });
      dispatch({ type: "tryAnother", excludeIds: used });
    } else {
      alert("No further variations available with your current constraints.");
    }
  }
  
  return (
    <Screen
      title={rec.sessionTitle}
      subtitle={`${rec.totalMinutes} min • ${rec.level} • ${rec.focus}`}
      footer={
        <div className="space-y-3">
          <Link href={`/session/${rec.exercises[0].id}`} className="block rounded-2xl bg-emerald-500 px-5 py-4 text-center font-semibold text-black">
            Start Session
          </Link>
          <button onClick={tryAnother} className="w-full rounded-2xl bg-white/5 px-5 py-4 font-semibold">
            Try Another
          </button>
        </div>
      }
    >
      <p className="text-sm text-white/70">{rec.rationale}</p>
      <div className="pt-3 space-y-3">
        {rec.exercises.map((ex, i) => (
          <Link key={ex.id} href={`/session/${ex.id}`} className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wide text-emerald-400">{ex.category}</div>
              <div className="text-xs text-white/50">{ex.duration} min</div>
            </div>
            <div className="mt-1 font-semibold">{i + 1}. {ex.name}</div>
            <div className="mt-1 text-xs text-white/60">{ex.whySelected}</div>
          </Link>
        ))}
      </div>
    </Screen>
  );
}
