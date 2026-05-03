import type { Archetype, ArchetypeId, Tag } from "./types";
import { ARCHETYPE_IDS, TAGS } from "./types";

const zero = (): Record<Tag, number> =>
  TAGS.reduce((acc, t) => ((acc[t] = 0), acc), {} as Record<Tag, number>);

const profile = (overrides: Partial<Record<Tag, number>>): Record<Tag, number> => ({
  ...zero(),
  ...overrides,
});

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  "zen-master": {
    id: "zen-master",
    profile: profile({ chill: 2, wise: 2, nocturnal: -1 }),
    accent: "chart-2",
    accessory: "leaf",
  },
  "foodie-lounger": {
    id: "foodie-lounger",
    profile: profile({ foodie: 3, chill: 1 }),
    accent: "chart-3",
    accessory: "bowl",
  },
  "adventure-seeker": {
    id: "adventure-seeker",
    profile: profile({ adventure: 3, chill: -1 }),
    accent: "chart-4",
    accessory: "hat",
  },
  "social-bather": {
    id: "social-bather",
    profile: profile({ social: 3, chill: 1 }),
    accent: "chart-1",
    accessory: "towel",
  },
  "lone-floater": {
    id: "lone-floater",
    profile: profile({ social: -3, chill: 1, wise: 1 }),
    accent: "chart-5",
    accessory: "none",
  },
  "hot-spring-sage": {
    id: "hot-spring-sage",
    profile: profile({ wise: 3, chill: 1, social: -1 }),
    accent: "chart-2",
    accessory: "towel",
  },
  sunbather: {
    id: "sunbather",
    profile: profile({ chill: 2, foodie: 1, adventure: -1, nocturnal: -1 }),
    accent: "chart-1",
    accessory: "sunglasses",
  },
  "night-owl": {
    id: "night-owl",
    profile: profile({ nocturnal: 3, wise: 1 }),
    accent: "chart-5",
    accessory: "moon",
  },
};

export const ARCHETYPE_LIST: Archetype[] = ARCHETYPE_IDS.map((id) => ARCHETYPES[id]);

export function isArchetypeId(value: string): value is ArchetypeId {
  return (ARCHETYPE_IDS as readonly string[]).includes(value);
}
