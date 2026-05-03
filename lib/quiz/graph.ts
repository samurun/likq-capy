import type { QuestionNode } from "./types";

export const START = "q_intro";

export const NODES: Record<string, QuestionNode> = {
  q_intro: {
    id: "q_intro",
    promptKey: "questions.q_intro.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_intro.choice.a",
        tags: { chill: 2, wise: 1 },
        next: "q_morning",
      },
      {
        id: "b",
        labelKey: "questions.q_intro.choice.b",
        tags: { adventure: 2 },
        next: "q_adventure",
      },
      {
        id: "c",
        labelKey: "questions.q_intro.choice.c",
        tags: { social: 2 },
        next: "q_social",
      },
      {
        id: "d",
        labelKey: "questions.q_intro.choice.d",
        tags: { nocturnal: 2 },
        next: "q_night",
      },
    ],
  },

  q_morning: {
    id: "q_morning",
    promptKey: "questions.q_morning.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_morning.choice.a",
        tags: { chill: 2, wise: 1 },
        next: "q_water",
      },
      {
        id: "b",
        labelKey: "questions.q_morning.choice.b",
        tags: { chill: 1, foodie: 2 },
        next: "q_companion",
      },
      {
        id: "c",
        labelKey: "questions.q_morning.choice.c",
        tags: { chill: 1, adventure: 1 },
        next: "q_water",
      },
    ],
  },

  q_adventure: {
    id: "q_adventure",
    promptKey: "questions.q_adventure.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_adventure.choice.a",
        tags: { adventure: 2, wise: 1 },
        next: "q_companion",
      },
      {
        id: "b",
        labelKey: "questions.q_adventure.choice.b",
        tags: { adventure: 2, social: 1 },
        next: "q_water",
      },
      {
        id: "c",
        labelKey: "questions.q_adventure.choice.c",
        tags: { adventure: 1, chill: 1 },
        next: "q_water",
      },
    ],
  },

  q_social: {
    id: "q_social",
    promptKey: "questions.q_social.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_social.choice.a",
        tags: { social: 2, foodie: 1 },
        next: "q_companion",
      },
      {
        id: "b",
        labelKey: "questions.q_social.choice.b",
        tags: { social: 1, wise: 1 },
        next: "q_companion",
      },
      {
        id: "c",
        labelKey: "questions.q_social.choice.c",
        tags: { social: -1, chill: 1 },
        next: "q_water",
      },
    ],
  },

  q_night: {
    id: "q_night",
    promptKey: "questions.q_night.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_night.choice.a",
        tags: { nocturnal: 1, wise: 1, social: -1 },
        next: "q_water",
      },
      {
        id: "b",
        labelKey: "questions.q_night.choice.b",
        tags: { nocturnal: 1, foodie: 2 },
        next: "q_companion",
      },
      {
        id: "c",
        labelKey: "questions.q_night.choice.c",
        tags: { nocturnal: 2, chill: 1 },
        next: "q_water",
      },
    ],
  },

  q_water: {
    id: "q_water",
    promptKey: "questions.q_water.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_water.choice.a",
        tags: { chill: 1, wise: 2 },
        next: "q_food",
      },
      {
        id: "b",
        labelKey: "questions.q_water.choice.b",
        tags: { chill: 2 },
        next: "q_food",
      },
      {
        id: "c",
        labelKey: "questions.q_water.choice.c",
        tags: { social: 2, adventure: 1 },
        next: "q_food",
      },
    ],
  },

  q_companion: {
    id: "q_companion",
    promptKey: "questions.q_companion.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_companion.choice.a",
        tags: { social: 1, wise: 1 },
        next: "q_food",
      },
      {
        id: "b",
        labelKey: "questions.q_companion.choice.b",
        tags: { social: 2 },
        next: "q_food",
      },
      {
        id: "c",
        labelKey: "questions.q_companion.choice.c",
        tags: { social: -2, chill: 1 },
        next: "q_food",
      },
    ],
  },

  q_food: {
    id: "q_food",
    promptKey: "questions.q_food.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_food.choice.a",
        tags: { foodie: 1, chill: 1 },
        next: "q_final",
      },
      {
        id: "b",
        labelKey: "questions.q_food.choice.b",
        tags: { foodie: 2 },
        next: "q_final",
      },
      {
        id: "c",
        labelKey: "questions.q_food.choice.c",
        tags: { foodie: 1, nocturnal: 1 },
        next: "q_final",
      },
      {
        id: "d",
        labelKey: "questions.q_food.choice.d",
        tags: { chill: 2 },
        next: "q_final",
      },
    ],
  },

  q_final: {
    id: "q_final",
    promptKey: "questions.q_final.prompt",
    choices: [
      {
        id: "a",
        labelKey: "questions.q_final.choice.a",
        tags: { nocturnal: 1, wise: 1 },
        next: null,
      },
      {
        id: "b",
        labelKey: "questions.q_final.choice.b",
        tags: { social: 1 },
        next: null,
      },
      {
        id: "c",
        labelKey: "questions.q_final.choice.c",
        tags: { chill: 1, wise: 1 },
        next: null,
      },
      {
        id: "d",
        labelKey: "questions.q_final.choice.d",
        tags: { adventure: 1 },
        next: null,
      },
    ],
  },
};

export function getNode(id: string): QuestionNode {
  const node = NODES[id];
  if (!node) throw new Error(`Unknown quiz node: ${id}`);
  return node;
}

export const ESTIMATED_DEPTH = 5;
