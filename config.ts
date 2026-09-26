import type { ScoringWeights, Minutes, Focus } from "./types";

export const DEFAULT_WEIGHTS: ScoringWeights = {
  focus: 30, position: 20, equipment: 15,
  space: 10, level: 10, time: 10, variety: 5,
};

export const TIME_TOLERANCE = 0.20; // +20%

/** Session templates: how many main exercises per duration. */
export const SESSION_TEMPLATES: Record<Minutes, { mains: [number, number] }> = {
  15: { mains: [1, 2] },
  30: { mains: [3, 3] },
  45: { mains: [4, 5] },
  60: { mains: [5, 7] },
  90: { mains: [6, 8] },
};

/** Focus aliases: MVP focus → dataset focus tokens. */
export const FOCUS_MAP: Record<Focus, string[]> = {
  "ball control": ["ball control", "close control"],
  "passing": ["passing"],
  "first touch": ["first touch"],
  "dribbling": ["dribbling", "1v1", "change of direction", "turning"],
  "shooting": ["shooting", "finishing"],
  "finishing": ["finishing", "shooting"],
  "crossing": ["crossing"],
  "weak foot": ["weak foot"],
  "speed": ["speed", "acceleration"],
  "agility": ["agility", "footwork", "change of direction", "coordination"],
  "stamina": ["stamina", "endurance", "conditioning"],
  "strength": ["strength", "legs", "upper body", "core", "posterior chain", "stability", "ankle", "calf"],
  "football iq": ["football IQ", "scanning", "decision making", "positioning", "movement", "defensive awareness", "creating space"],
  "defending": ["defending", "defensive awareness", "footwork"],
  "goalkeeping": ["goalkeeping"],
  "mobility": ["mobility", "cooldown", "warmup"],
};