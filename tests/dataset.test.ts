import { describe, it, expect } from "vitest";
import { loadExercises } from "../lib/recommendation";

describe("dataset", () => {
  it("loads 50 exercises", () => {
    const ex = loadExercises();
    expect(ex).toHaveLength(50);
  });

  it("preserves exercise IDs", () => {
    const ex = loadExercises();
    expect(ex[0].exercise_id).toBe("EX001");
    expect(ex[49].exercise_id).toBe("EX050");
  });

  it("every exercise has required fields", () => {
    for (const e of loadExercises()) {
      expect(e.exercise_id).toBeTruthy();
      expect(e.exercise_name).toBeTruthy();
      expect(e.instructions.length).toBeGreaterThan(10);
      expect(e.min_minutes).toBeGreaterThan(0);
      expect(e.max_minutes).toBeGreaterThanOrEqual(e.min_minutes);
    }
  });
});
