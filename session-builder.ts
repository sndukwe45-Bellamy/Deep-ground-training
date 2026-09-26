import type { Exercise, ScoredExercise, TrainingInput, Minutes } from "./types";
import { SESSION_TEMPLATES, TIME_TOLERANCE } from "./config";
import { scoreExercise } from "./scoring";
import { byCategory } from "./filters";

interface BuildResult {
  exercises: ScoredExercise[];
  totalMinutes: number;
}

export function buildSession(
  eligible: Exercise[],
  input: TrainingInput,
  excludeIds: Set < string >
): BuildResult | null {
  const budget = Math.floor(input.minutes * (1 + TIME_TOLERANCE));
  const template = SESSION_TEMPLATES[input.minutes as Minutes];
  if (!template) return null;
  
  const warmup = pickOne(byCategory(eligible, "Warm-up"), input, excludeIds);
  const cooldown = pickOne(
    [...byCategory(eligible, "Recovery"), ...byCategory(eligible, "Warm-up")],
    input,
    excludeIds
  );
  
  if (!warmup || !cooldown) return null;
  
  const warmupDur = warmup.min_minutes;
  const cooldownDur = cooldown.min_minutes;
  let remaining = budget - warmupDur - cooldownDur;
  
  const mainPool = eligible.filter(
    (ex) => ex.category !== "Warm-up" && ex.category !== "Recovery"
  );
  
  const scoredPool = mainPool
    .filter((ex) => !excludeIds.has(ex.exercise_id))
    .map((ex) => {
      const { score, why } = scoreExercise(ex, input);
      return { ...ex, score, whySelected: why, chosenDuration: ex.min_minutes } as ScoredExercise;
    })
    .sort((a, b) => b.score - a.score);
  
  const mains: ScoredExercise[] = [];
  const usedCategories = new Set < string > ();
  
  for (const ex of scoredPool) {
    if (mains.length >= template.mains[1]) break;
    if (ex.min_minutes > remaining) continue;
    if (usedCategories.has(ex.category) && mains.length < template.mains[0]) continue;
    mains.push(ex);
    usedCategories.add(ex.category);
    remaining -= ex.min_minutes;
    if (remaining <= 0) break;
  }
  
  if (mains.length < template.mains[0]) return null;
  
  const exercises = [
    { ...warmup, score: 0, whySelected: "prepares the body for training", chosenDuration: warmupDur },
    ...mains,
    { ...cooldown, score: 0, whySelected: "brings the session down safely", chosenDuration: cooldownDur },
  ];
  
  const totalMinutes = exercises.reduce((sum, e) => sum + e.chosenDuration, 0);
  return { exercises, totalMinutes };
}

function pickOne(
  pool: Exercise[],
  input: TrainingInput,
  excludeIds: Set < string >
): Exercise | null {
  if (pool.length === 0) return null;
  const fresh = pool.filter((ex) => !excludeIds.has(ex.exercise_id));
  const candidates = fresh.length > 0 ? fresh : pool;
  const { scoreExercise: _ } = { scoreExercise: null };
  return candidates
    .map((ex) => ({ ex, s: scoreExerciseSafe(ex, input) }))
    .sort((a, b) => b.s - a.s)[0].ex;
}

function scoreExerciseSafe(ex: Exercise, input: TrainingInput): number {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { scoreExercise } = require("./scoring");
    return scoreExercise(ex, input).score;
  } catch {
    return 0;
  }
}