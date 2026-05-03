"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { NODES, START } from "./graph";
import { applyChoice, emptyTotals } from "./score";
import type { Choice, HistoryEntry, QuizState, Tag } from "./types";

const TERMINAL = "__terminal__";

type Actions = {
  choose: (choice: Choice) => void;
  back: () => void;
  reset: () => void;
};

export type QuizStore = QuizState & Actions & { isTerminal: boolean };

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      currentNodeId: START,
      history: [],
      tagTotals: emptyTotals(),
      get isTerminal() {
        return get().currentNodeId === TERMINAL;
      },

      choose: (choice) =>
        set((state) => {
          const entry: HistoryEntry = {
            nodeId: state.currentNodeId,
            choiceId: choice.id,
          };
          return {
            currentNodeId: choice.next ?? TERMINAL,
            history: [...state.history, entry],
            tagTotals: applyChoice(state.tagTotals, state.currentNodeId, choice.id),
          };
        }),

      back: () =>
        set((state) => {
          if (state.history.length === 0) return state;
          const prev = state.history[state.history.length - 1];
          const node = NODES[prev.nodeId];
          const choice = node?.choices.find((c) => c.id === prev.choiceId);
          const rolledBack = { ...state.tagTotals };
          if (choice) {
            for (const [tag, delta] of Object.entries(choice.tags) as [
              Tag,
              number,
            ][]) {
              rolledBack[tag] = (rolledBack[tag] ?? 0) - delta;
            }
          }
          return {
            currentNodeId: prev.nodeId,
            history: state.history.slice(0, -1),
            tagTotals: rolledBack,
          };
        }),

      reset: () =>
        set({
          currentNodeId: START,
          history: [],
          tagTotals: emptyTotals(),
        }),
    }),
    {
      name: "capybara-quiz:v1",
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? (undefined as unknown as Storage)
          : window.sessionStorage,
      ),
      partialize: (s) => ({
        currentNodeId: s.currentNodeId,
        history: s.history,
        tagTotals: s.tagTotals,
      }),
      skipHydration: true,
    },
  ),
);

export const isTerminalNode = (id: string) => id === TERMINAL;
