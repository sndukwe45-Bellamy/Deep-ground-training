export type Position = "goalkeeper" | "defender" | "midfielder" | "attacker" | "unsure";
export type Minutes = 15 | 30 | 45 | 60 | 90;
export type TrainingPeriod = "morning" | "afternoon" | "night";
export type Frequency = "1_day" | "2_3_days" | "4_5_days" | "almost_daily";
export type Equipment = |
  "none" | "football" | "cones" | "wall" | "jump rope" |
  "goal" | "agility ladder" | "resistance bands" | "weights" | "training partner";
export type Space = |
  "small indoor" | "small open area" | "backyard" | "pitch" | "gym";
export type Focus = |
  "ball control" | "passing" | "first touch" | "dribbling" |
  "shooting" | "finishing" | "crossing" | "weak foot" |
  "speed" | "agility" | "stamina" | "strength" |
  "football iq" | "defending" | "goalkeeping" | "mobility";
export type Level = "beginner" | "intermediate" | "advanced";

export interface TrainingInput {
  position: Position;
  minutes: Minutes;
  trainingPeriod: TrainingPeriod;
  frequency: Frequency;
  equipment: Equipment[];
  space: Space;
  focus: Focus;
  level: Level;
}

export interface Exercise {
  exercise_id: string;
  exercise_name: string;
  category: string;
  positions: string[];
  focus: string[];
  min_minutes: number;
  max_minutes: number;
  equipment: string[];
  space: string[];
  intensity: string;
  instructions: string;
  dosage: string;
  level: string[];
}

export interface ScoredExercise extends Exercise {
  score: number;
  whySelected: string;
  chosenDuration: number;
}

export interface SessionExercise {
  id: string;
  name: string;
  duration: number;
  dosage: string;
  instructions: string;
  category: string;
  whySelected: string;
}

export interface RecommendationResult {
  kind: "recommendation";
  sessionTitle: string;
  rationale: string;
  totalMinutes: number;
  level: Level;
  focus: Focus;
  equipment: string[];
  space: Space;
  exercises: SessionExercise[];
}

export interface NoSessionResult {
  kind: "no-session";
  reason: string;
  relaxation ? : {
    label: string;
    apply: (input: TrainingInput) => TrainingInput;
  };
}

export type EngineResult = RecommendationResult | NoSessionResult;

export interface ScoringWeights {
  focus: number;
  position: number;
  equipment: number;
  space: number;
  level: number;
  time: number;
  variety: number;
}
