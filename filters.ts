import type { Exercise, TrainingInput, Focus } from "./types";
import { normalizePositions, normalizeSpaces, normalizeEquipment, SPACE_FALLBACK } from "./aliases";
import { FOCUS_MAP } from "./config";

export function positionMatches(ex: Exercise, input: TrainingInput): boolean {
  const positions = normalizePositions(ex.positions);
  if (input.position === "unsure") return true;
  return positions.has(input.position);
}

export function equipmentAllowed(ex: Exercise, input: TrainingInput): boolean {
  const required = normalizeEquipment(ex.equipment);
  for (const req of required) {
    if (!input.equipment.includes(req)) return false;
  }
  return true;
}

export function spaceAllowed(ex: Exercise, input: TrainingInput): boolean {
  const exSpaces = normalizeSpaces(ex.space);
  const acceptable = SPACE_FALLBACK[input.space] ?? [input.space];
  for (const s of exSpaces) {
    if (acceptable.includes(s)) return true;
  }
  return false;
}

export function levelAllowed(ex: Exercise, input: TrainingInput): boolean {
  const levels = ex.level.map((l) => l.trim().toLowerCase());
  return levels.includes(input.level);
}

export function focusMatches(ex: Exercise, focus: Focus): boolean {
  const tokens = FOCUS_MAP[focus] ?? [focus];
  const exFocus = ex.focus.map((f) => f.trim().toLowerCase());
  return exFocus.some((f) => tokens.map((t) => t.toLowerCase()).includes(f));
}

export function fitsTime(ex: Exercise, available: number): boolean {
  return ex.min_minutes <= available;
}

export function applyHardFilters(exercises: Exercise[], input: TrainingInput): Exercise[] {
  return exercises.filter((ex) => {
    return (
      positionMatches(ex, input) &&
      equipmentAllowed(ex, input) &&
      spaceAllowed(ex, input) &&
      levelAllowed(ex, input)
    );
  });
}

/** Slot helpers: filter to a category, else empty. */
export function byCategory(exercises: Exercise[], category: string): Exercise[] {
  return exercises.filter((ex) => ex.category === category);
}