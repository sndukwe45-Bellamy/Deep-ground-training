"use client";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/lib/state/questionnaire";
import { Screen } from "@/components/ui/Screen";
import { ChoiceCard } from "@/components/questionnaire/ChoiceCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

const OPTIONS = [
  { key: "goalkeeper", label: "Goalkeeper" },
  { key: "defender", label: "Defender" },
  { key: "midfielder", label: "Midfielder" },
  { key: "attacker", label: "Attacker" },
  { key: "unsure", label: "I'm not sure" },
] as const;

export default function PositionPage() {
  const { state, dispatch } = useQuestionnaire();
  const router = useRouter();

  return (
    <Screen title="What's your position?" subtitle="Step 1 of 7" footer={<div />}>
      <ProgressBar current={1} total={7} />
      <div className="pt-4 space-y-3">
        {OPTIONS.map((o) => (
          <ChoiceCard
            key={o.key}
            label={o.label}
            selected={state.draft.position === o.key}
            onClick={() => {
              if (o.key === "unsure") {
                router.push("/questionnaire/position-finder");
              } else {
                dispatch({ type: "set", patch: { position: o.key } });
                router.push("/questionnaire/time");
              }
            }}
          />
        ))}
      </div>
    </Screen>
  );
}
