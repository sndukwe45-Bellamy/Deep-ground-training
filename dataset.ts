import raw from "../../data/exercises.json";
import type { Exercise } from "./types";
import { normalizePositions, normalizeSpaces, normalizeEquipment } from "./aliases";

interface RawExercise {
  exercise_id: string;
  exercise_name: string;
  category: string;
  positions: string;
  focus: string;
  min_minutes: number;
  max_minutes: number;
  equipment: string;
  space: string;
  intensity: string;
  instructions: string;
  dosage: string;
  level: string;
}

function splitPipe(value: string): string[] {
  return value.split("|").map((s) => s.trim()).filter(Boolean);
}

export function loadExercises(): Exercise[] {
  const rows = raw as RawExercise[];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Dataset is empty or malformed");
  }
  for (const r of rows) {
    if (!r.exercise_id || !r.exercise_name) {
      throw new Error(`Malformed exercise row: ${JSON.stringify(r)}`);
    }
  }
  return rows.map((r) => ({
    exercise_id: r.exercise_id,
    exercise_name: r.exercise_name,
    category: r.category,
    positions: splitPipe(r.positions),
    focus: splitPipe(r.focus),
    min_minutes: r.min_minutes,
    max_minutes: r.max_minutes,
    equipment: splitPipe(r.equipment),
    space: splitPipe(r.space),
    intensity: r.intensity,
    instructions: r.instructions,
    dosage: r.dosage,
    level: splitPipe(r.level),
  }));
}