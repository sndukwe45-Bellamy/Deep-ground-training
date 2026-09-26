import type {
  TrainingInput, EngineResult, RecommendationResult, NoSessionResult, Exercise,
} from "./types";
import { loadExercises } from "./dataset";
import { applyHardFilters, focusMatches } from "./filters";
import { buildSession } from "./session-builder";
import { DEFAULT_WEIGHTS } from "./config";

export interface RecommendOptions {
  excludeIds?: string[];
  weights?: typeof DEFAULT_WEIGHTS;
}

let cachedExercises: Exercise[] | null = null;

function getExercises(): Exercise[] {
  if (!cachedExercises) cachedExercises = loadExercises();
  return cachedExercises;
}

export function recommend(
  input: TrainingInput,
  options: RecommendOptions = {}
): EngineResult {
  const excludeIds = new Set(options.excludeIds ?? []);
  let exercises: Exercise[];
  try {
    exercises = getExercises();
  } catch (err) {
    return {
      kind: "no-session",
      reason: `Dataset unavailable: ${(err as Error).message}`,
    };
  }

  const eligible = applyHardFilters(exercises, input);

  if (eligible.length === 0) {
    return {
      kind: "no-session",
      reason: `No exercises match your equipment (${input.equipment.join(", ") || "none"}) and space (${input.space}).`,
      relaxation: {
        label: "Allow any space",
        apply: (i) => ({ ...i, space: "small open area" }),
      },
    };
  }

  // Focus coverage check
  const focusCovered = eligible.some((ex) => focusMatches(ex, input.focus));
  const effectiveInput = focusCovered ? input : { ...input, focus: "mobility" as const };

  const built = buildSession(eligible, effectiveInput, excludeIds);
  if (!built) {
    return {
      kind: "no-session",
      reason: `Not enough matching exercises for a ${input.minutes}-minute session with your constraints.`,
      relaxation: {
        label: "Add 5 minutes",
        apply: (i) => ({ ...i, minutes: (Math.min(i.minutes + 5, 90) as TrainingInput["minutes"]) }),
      },
    };
  }

  const sessionTitle = buildTitle(input);
  const rationale = buildRationale(input, built.exercises.length);

  const result: RecommendationResult = {
    kind: "recommendation",
    sessionTitle,
    rationale,
    totalMinutes: built.totalMinutes,
    level: input.level,
    focus: input.focus,
    equipment: input.equipment,
    space: input.space,
    exercises: built.exercises.map((e) => ({
      id: e.exercise_id,
      name: e.exercise_name,
      duration: e.chosenDuration,
      dosage: e.dosage,
      instructions: e.instructions,
      category: e.category,
      whySelected: e.whySelected,
    })),
  };
  return result;
}

function buildTitle(input: TrainingInput): string {
  const pos = input.position === "unsure" ? "All-Round" : capitalize(input.position);
  const focus = capitalize(input.focus);
  return `${pos} ${focus} Session`;
}

function buildRationale(input: TrainingInput, count: number): string {
  const pos = input.position === "unsure" ? "your game" : `your position (${input.position})`;
  return `Based on ${pos}, ${input.minutes} minutes available, your equipment and your goal of ${input.focus}, this ${count}-exercise session focuses on realistic development work you can do today.`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
