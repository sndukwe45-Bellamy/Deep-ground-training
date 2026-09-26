"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";
import type { TrainingInput, RecommendationResult } from "@/lib/recommendation";

type Draft = Partial < TrainingInput > ;

interface State {
  draft: Draft;
  recommendation: RecommendationResult | null;
  excludeIds: string[];
  step: number;
}

type Action = |
  { type: "set";patch: Draft } |
  { type: "setRecommendation";value: RecommendationResult } |
  { type: "tryAnother";excludeIds: string[] } |
  { type: "reset" };

const initialState: State = { draft: {}, recommendation: null, excludeIds: [], step: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set":
      return { ...state, draft: { ...state.draft, ...action.patch } };
    case "setRecommendation":
      return { ...state, recommendation: action.value };
    case "tryAnother":
      return { ...state, excludeIds: action.excludeIds, recommendation: null };
    case "reset":
      return initialState;
  }
}

const Ctx = createContext < { state: State;dispatch: React.Dispatch < Action > } | null > (null);

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useQuestionnaire() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuestionnaire must be used within QuestionnaireProvider");
  return ctx;
}