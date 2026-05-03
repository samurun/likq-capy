export const TAGS = [
  "chill",
  "social",
  "adventure",
  "foodie",
  "nocturnal",
  "wise",
] as const;
export type Tag = (typeof TAGS)[number];

export const ARCHETYPE_IDS = [
  "zen-master",
  "foodie-lounger",
  "adventure-seeker",
  "social-bather",
  "lone-floater",
  "hot-spring-sage",
  "sunbather",
  "night-owl",
] as const;
export type ArchetypeId = (typeof ARCHETYPE_IDS)[number];

export type TagDelta = Partial<Record<Tag, number>>;

export type Choice = {
  id: string;
  labelKey: string;
  tags: TagDelta;
  next: string | null;
};

export type QuestionNode = {
  id: string;
  promptKey: string;
  choices: Choice[];
};

export type Archetype = {
  id: ArchetypeId;
  profile: Record<Tag, number>;
  accent: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";
  accessory: "none" | "leaf" | "sunglasses" | "hat" | "bowl" | "towel" | "moon" | "sun";
};

export type HistoryEntry = { nodeId: string; choiceId: string };

export type QuizState = {
  currentNodeId: string;
  history: HistoryEntry[];
  tagTotals: Record<Tag, number>;
};

export const LOCALES = ["en", "th"] as const;
export type Locale = (typeof LOCALES)[number];
