/** Platform-neutral contracts. Never put browser, WeChat or React Native APIs here. */
export type JuniorPlatform = "web" | "wechat" | "ios" | "android";
export type Side = "pro" | "con";
export type DebateMode = "demo" | "live";
export type PhaseId = "constructive" | "rebuttal" | "summary" | "final-focus";
export type SkillId = "claim" | "reason" | "example" | "impact" | "response" | "weighing" | "signpost";

export interface TopicSummary {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  category: string;
  context: string;
}

export interface TurnHistoryItem {
  user: string;
  opponent: string;
}

export interface TurnRequest {
  topicId: string;
  side: Side;
  level: number;
  text: string;
  demo: boolean;
  history: TurnHistoryItem[];
}

export interface FeedbackScores {
  clarity: number;
  reasoning: number;
  response: number;
  english: number;
}

export interface TurnFeedback {
  strength: string;
  improvement: string;
  rewrite: string;
  nextStep: string;
  evidenceQuote: string;
  languageNote: string;
  scores: FeedbackScores | null;
}

export interface TurnResponse {
  opponent: string;
  feedback: TurnFeedback;
  mode: DebateMode;
}

export interface ServiceStatus {
  live: boolean;
  transcription: boolean;
  provider: string | null;
}

export interface ApiError { error: string; requestId?: string }

export const API_ROUTES = {
  status: "/api/status",
  turn: "/api/turn",
  transcribe: "/api/transcribe",
  sync: "/api/v1/sync"
} as const;

export const PHASES: ReadonlyArray<{id: PhaseId; name: string; expected: readonly SkillId[]}> = [
  { id: "constructive", name: "Constructive", expected: ["claim", "reason", "example", "impact"] },
  { id: "rebuttal", name: "Rebuttal", expected: ["response", "reason", "impact"] },
  { id: "summary", name: "Summary", expected: ["response", "weighing", "impact", "signpost"] },
  { id: "final-focus", name: "Final focus", expected: ["claim", "weighing", "impact", "signpost"] }
] as const;
