import { describe, it, expect } from "vitest";
import { recommend } from "../lib/recommendation";
import type { TrainingInput } from "../lib/recommendation";

const base: TrainingInput = {
  position: "midfielder",
  minutes: 30,
  trainingPeriod: "morning",
  frequency: "2_3_days",
  equipment: ["football", "cones"],
  space: "small open area",
  focus: "ball control",
  level: "intermediate",
};

describe("recommendation engine", () => {
  it("returns a recommendation for the default input", () => {
    const r = recommend(base);
    expect(r.kind).toBe("recommendation");
  });

  it("covers all positions without crashing", () => {
    const positions = ["goalkeeper", "defender", "midfielder", "attacker", "unsure"] as const;
    for (const position of positions) {
      const r = recommend({ ...base, position, equipment: ["football", "cones", "goal", "agility ladder", "wall"], space: "pitch" });
      expect(r.kind).toBeDefined();
    }
  });

  it("never recommends unavailable equipment", () => {
    const r = recommend({ ...base, equipment: ["none"], space: "small indoor", focus: "strength" });
    if (r.kind !== "recommendation") return;
    for (const ex of r.exercises) {
      // Only 'none' exercises allowed
      expect(["Bodyweight Squat","Reverse Lunge","Single-Leg Calf Raise","Glute Bridge","Push-Up","Plank","Dead Bug","Dynamic Mobility Warm-Up","Cooldown Mobility"]).toContain(ex.name);
    }
  });

  it("never recommends incompatible space", () => {
    const r = recommend({ ...base, space: "small indoor", equipment: ["football", "cones"], focus: "dribbling" });
    if (r.kind !== "recommendation") return;
    for (const ex of r.exercises) {
      expect(["Dynamic Mobility Warm-Up","Ball-Familiarity Touches","Sole Roll & Pull","Tight-Space Ball Mastery","Cooldown Mobility","Easy Ball Recovery","Bodyweight Squat","Reverse Lunge","Single-Leg Calf Raise","Glute Bridge","Push-Up","Plank","Dead Bug","Jump-Rope Intervals","Single-Leg Calf Raise"]).toContain(ex.name);
    }
  });

  it("stays within time tolerance", () => {
    for (const minutes of [15, 30, 45, 60, 90] as const) {
      const r = recommend({ ...base, minutes });
      if (r.kind !== "recommendation") continue;
      expect(r.totalMinutes).toBeLessThanOrEqual(Math.floor(minutes * 1.2));
    }
  });

  it("returns no-session when nothing matches", () => {
    const r = recommend({ ...base, equipment: ["none"], space: "small indoor", focus: "goalkeeping", position: "goalkeeper" });
    // Goalkeeper content requires goal + pitch; expect graceful failure
    expect(r.kind).toBe("no-session");
  });

  it("Try Another excludes previously shown exercises", () => {
    const first = recommend(base);
    expect(first.kind).toBe("recommendation");
    if (first.kind !== "recommendation") return;
    const excludeIds = first.exercises.map((e) => e.id);
    const second = recommend(base, { excludeIds });
    if (second.kind === "recommendation") {
      for (const e of second.exercises) {
        expect(excludeIds).not.toContain(e.id);
      }
    }
  });
});