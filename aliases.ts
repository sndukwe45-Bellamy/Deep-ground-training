import type { Position, Space, Equipment } from "./types";

/** Position: dataset token → canonical MVP position tokens it satisfies. */
export const POSITION_ALIASES: Record < string, Position[] > = {
  "all": ["goalkeeper", "defender", "midfielder", "attacker", "unsure"],
  "goalkeeper": ["goalkeeper"],
  "defender": ["defender"],
  "full-back": ["defender"],
  "midfielder": ["midfielder"],
  "attacker": ["attacker"],
  "winger": ["attacker"],
};

/** Space: dataset token → canonical MVP space. */
export const SPACE_ALIASES: Record < string, Space > = {
  "small indoor": "small indoor",
  "small open area": "small open area",
  "pitch": "pitch",
  "large open area": "pitch",
};

/** MVP space → dataset spaces considered equivalent. */
export const SPACE_FALLBACK: Record < Space, string[] > = {
  "small indoor": ["small indoor"],
  "small open area": ["small open area"],
  "pitch": ["pitch", "large open area"],
  "backyard": ["small open area"],
  "gym": ["small indoor"],
};

/** Equipment: dataset token → canonical MVP equipment (or null to ignore). */
export const EQUIPMENT_ALIASES: Record < string, Equipment | null > = {
  "none": null,
  "support": null,
  "football": "football",
  "cones": "cones",
  "wall": "wall",
  "jump rope": "jump rope",
  "goal": "goal",
  "agility ladder": "agility ladder",
};

export function normalizePositions(raw: string[]): Set < Position > {
  const out = new Set < Position > ();
  for (const p of raw) {
    const key = p.trim().toLowerCase();
    const mapped = POSITION_ALIASES[key];
    if (mapped) mapped.forEach((m) => out.add(m));
  }
  return out;
}

export function normalizeSpaces(raw: string[]): Set < Space > {
  const out = new Set < Space > ();
  for (const s of raw) {
    const mapped = SPACE_ALIASES[s.trim().toLowerCase()];
    if (mapped) out.add(mapped);
  }
  return out;
}

export function normalizeEquipment(raw: string[]): Set < Equipment > {
  const out = new Set < Equipment > ();
  for (const e of raw) {
    const mapped = EQUIPMENT_ALIASES[e.trim().toLowerCase()];
    if (mapped) out.add(mapped);
  }
  return out;
}