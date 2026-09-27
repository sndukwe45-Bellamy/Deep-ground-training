"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { recommend, type TrainingInput } from "@/lib/recommendation";
import { TrainingInputSchema } from "@/lib/validation/input";

export default function CompletePage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();
  const rec = state.recommendation;

  if (!rec) {
    return (
      <Screen title="Session complete" subtitle="Nice work. Start another when ready.">
        <Link
          href="/"
          className="block rounded-2xl bg-emerald-500 px-5 py-4 text-center font-semibold text-black"
        >
          Back to home
        </Link>
      </Screen>
    );
  }

  function tryAnother() {
    const parse = TrainingInputSchema.safeParse(state.draft);
    if (!parse.success) return;
    const used = [...state.excludeIds, ...rec.exercises.map((e) => e.id)];
    const next = recommend(parse.data as TrainingInput, { excludeIds: used });
    if (next.kind === "recommendation") {
      dispatch({ type: "setRecommendation", value: next });
      dispatch({ type: "tryAnother", excludeIds: used });
      router.push("/session");
    } else {
      alert("You've exhausted variations. Try changing your constraints.");
    }
  }

  return (
    <Screen
      title="Session complete"
      subtitle="Build your foundation. Improve your game."
      footer={
        <div className="space-y-3">
          <button
            onClick={tryAnother}
            className="w-full rounded-2xl bg-emerald-500 px-5 py-4 font-semibold text-black"
          >
            Try Another Session
          </button>
          <Link
            href="/"
            className="block rounded-2xl bg-white/5 px-5 py-4 text-center font-semibold"
          >
            Back to home
          </Link>
        </div>
      }
    >
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
        <div className="text-2xl font-bold">{rec.totalMinutes} min</div>
        <div className="mt-1 text-sm text-white/70">
          {rec.exercises.length} exercises • Focus: {rec.focus}
        </div>
      </div>
      <p className="text-sm text-white/70">
        You completed a {rec.level} session targeting {rec.focus}. Consistency is what builds the foundation.
      </p>
    </Screen>
  );
}
