import { z } from "zod";

export const TrainingInputSchema = z.object({
  position: z.enum(["goalkeeper", "defender", "midfielder", "attacker", "unsure"]),
  minutes: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60), z.literal(90)]),
  trainingPeriod: z.enum(["morning", "afternoon", "night"]),
  frequency: z.enum(["1_day", "2_3_days", "4_5_days", "almost_daily"]),
  equipment: z.array(z.enum([
    "none", "football", "cones", "wall", "jump rope",
    "goal", "agility ladder", "resistance bands", "weights", "training partner",
  ])),
  space: z.enum(["small indoor", "small open area", "backyard", "pitch", "gym"]),
  focus: z.enum([
    "ball control", "passing", "first touch", "dribbling",
    "shooting", "finishing", "crossing", "weak foot",
    "speed", "agility", "stamina", "strength",
    "football iq", "defending", "goalkeeping", "mobility",
  ]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
});

export type ValidatedTrainingInput = z.infer < typeof TrainingInputSchema > ;