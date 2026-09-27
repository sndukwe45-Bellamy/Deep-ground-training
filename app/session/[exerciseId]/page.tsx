"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { useState } from "react";

export default function ExerciseDetail() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { state } = useQuestionnaire();
  const router = useRouter();
  const rec = state.recommendation;
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  if (!rec) {
    return (
      <Screen title="No session" subtitle="Start a session first.">
        <button
          onClick={() => router.push("/questionnaire/position")}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-4 font-semibold text-black"
        >
          Start setup
        </button>
      </Screen>
    );
  }

  const idx = rec.exercises.findIndex((e) => e.id === exerciseId);
  const ex = rec.exercises[idx];

  if (!ex) {
    return (
      <Screen
        title="Exercise not found"
        footer={
          <button
            onClick={() => router.push("/session")}
            className="w-full rounded-2xl bg-white/5 px-5 py-4 font-semibold"
          >
            Back to session
          </button>
        }
      >
        <p className="text-sm text-white/60">
          This exercise is not part of your current session.
        </p>
      </Screen>
    );
  }

  const isLast = idx === rec.exercises.length - 1;
  const nextId = !isLast ? rec.exercises[idx + 1].id : null;

  function markComplete() {
    const next = new Set(completed);
    next.add(ex!.id);
    setCompleted(next);
    if (nextId) {
      router.push(`/session/${nextId}`);
    } else {
      router.push("/session/complete");
    }
  }

  return (
    <Screen
      title={ex.name}
      subtitle={`${ex.category} • ${ex.duration} min`}
      footer={
        <div className="space-y-3">
          <button
            onClick={markComplete}
            className="w-full rounded-2xl bg-emerald-500 px-5 py-4 font-semibold text-black"
          >
            {isLast ? "Finish Session" : "Mark Complete & Next"}
          </button>
          <button
            onClick={() => router.push("/session")}
            className="w-full rounded-2xl bg-white/5 px-5 py-4 font-semibold"
          >
            Back to session
          </button>
        </div>
      }
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wide text-emerald-400">Instructions</div>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{ex.instructions}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wide text-emerald-400">Dosage</div>
        <p className="mt-2 text-sm text-white/80">{ex.dosage}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wide text-emerald-400">Why this exercise</div>
        <p className="mt-2 text-sm text-white/80">{ex.whySelected}</p>
      </div>
    </Screen>
  );
}
