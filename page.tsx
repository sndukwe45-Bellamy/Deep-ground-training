"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { ChoiceCard } from "@/components/questionnaire/ChoiceCard";
import { Button } from "@/components/ui/Button";
import type { Position } from "@/lib/recommendation";

const ENJOYMENT = [
  { key: "creating", label: "Creating chances" },
  { key: "scoring", label: "Scoring" },
  { key: "defending", label: "Defending" },
  { key: "passing", label: "Passing" },
  { key: "running", label: "Running" },
  { key: "saving", label: "Saving shots" },
] as const;

const STRENGTHS = [
  { key: "speed", label: "Speed" },
  { key: "strength", label: "Strength" },
  { key: "passing", label: "Passing" },
  { key: "dribbling", label: "Dribbling" },
  { key: "finishing", label: "Finishing" },
  { key: "reading", label: "Reading the game" },
] as const;

export default function PositionFinder() {
  const [enjoy, setEnjoy] = useState<string | null>(null);
  const [strength, setStrength] = useState<string | null>(null);
  const [result, setResult] = useState<{ position: Position; why: string } | null>(null);
  const { dispatch } = useQuestionnaire();
  const router = useRouter();

  function suggest() {
    let position: Position = "midfielder";
    let why = "You enjoy being involved across the pitch and reading the game.";
    if (enjoy === "saving") { position = "goalkeeper"; why = "You enjoy saving shots and protecting the goal."; }
    else if (enjoy === "scoring" || strength === "finishing") { position = "attacker"; why = "You enjoy scoring and finishing chances."; }
    else if (enjoy === "defending" || strength === "strength") { position = "defender"; why = "You enjoy defending and using your strength."; }
    else if (strength === "speed") { position = "attacker"; why = "Your speed suits attacking transitions."; }
    else if (strength === "passing" || enjoy === "passing" || enjoy === "creating") { position = "midfielder"; why = "You enjoy creating and linking play."; }
    setResult({ position, why });
  }

  if (result) {
    return (
      <Screen
        title="Suggested position"
        subtitle={result.why}
        footer={
          <div className="space-y-3">
            <Button onClick={() => { dispatch({ type: "set", patch: { position: result.position } }); router.push("/questionnaire/time"); }}>
              Continue as {result.position}
            </Button>
            <Button variant="ghost" onClick={() => setResult(null)}>Change answers</Button>
          </div>
        }
      >
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-lg font-semibold capitalize">
          {result.position}
        </div>
        <p className="text-sm text-white/60">This is a suggestion, not a definitive assessment. You can change it later.</p>
      </Screen>
    );
  }

  return (
    <Screen
      title="Let's find your position"
      subtitle="Answer two quick questions."
      footer={<Button disabled={!enjoy || !strength} onClick={suggest}>Suggest my position</Button>}
    >
      <div className="space-y-2">
        <div className="text-sm font-semibold text-white/70">What do you enjoy most?</div>
        {ENJOYMENT.map((e) => (
          <ChoiceCard key={e.key} label={e.label} selected={enjoy === e.key} onClick={() => setEnjoy(e.key)} />
        ))}
      </div>
      <div className="space-y-2 pt-4">
        <div className="text-sm font-semibold text-white/70">What's your biggest strength?</div>
        {STRENGTHS.map((s) => (
          <ChoiceCard key={s.key} label={s.label} selected={strength === s.key} onClick={() => setStrength(s.key)} />
        ))}
      </div>
    </Screen>
  );
}