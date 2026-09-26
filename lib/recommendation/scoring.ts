import type { Exercise, TrainingInput, ScoringWeights } from "./types";
import { DEFAULT_WEIGHTS } from "./config";
import { focusMatches } from "./filters";

export function scoreExercise(
  ex: Exercise,
  input: TrainingInput,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): { score: number;why: string } {
  const reasons: string[] = [];
  let score = 0;
  
  if (focusMatches(ex, input.focus)) {
    score += weights.focus;
    reasons.push(`targets ${input.focus}`);
  }
  
  const positions = ex.positions.map((p) => p.toLowerCase());
  if (positions.includes("all")) {
    score += weights.position;
    reasons.push("works for any position");
  } else if (positions.some((p) => p.includes(input.position) || aliasHas(p, input.position))) {
    score += weights.position;
    reasons.push(`suited to ${input.position}s`);
  }
  
  // Equipment + space + level already hard-filtered; award full points.
  score += weights.equipment;
  score += weights.space;
  score += weights.level;
  
  // Time fit: prefer exercises whose max fits the remaining time.
  score += weights.time;
  
  return { score, why: reasons.join(", ") || "fits your session" };
}

function aliasHas(datasetToken: string, position: string): boolean {
  if (datasetToken === "winger" && position === "attacker") return true;
  if (datasetToken === "full-back" && position === "defender") return true;
  return false;
}
