"use client";

import { useSyncExternalStore } from "react";

import type { ArchetypeId, HistoryEntry, Locale } from "./types";
import { isArchetypeId } from "./archetypes";

export type ResultRecord = {
  id: string;
  timestamp: number;
  archetype: ArchetypeId;
  locale: Locale;
  path: HistoryEntry[];
};

const KEY = "capybara-quiz:results:v1";
const MAX_RESULTS = 50;
const EMPTY: ResultRecord[] = [];

let cache: ResultRecord[] | null = null;
const listeners = new Set<() => void>();

function isResultRecord(r: unknown): r is ResultRecord {
  if (!r || typeof r !== "object") return false;
  const candidate = r as Partial<ResultRecord>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.timestamp === "number" &&
    typeof candidate.archetype === "string" &&
    isArchetypeId(candidate.archetype) &&
    Array.isArray(candidate.path)
  );
}

function readStorage(): ResultRecord[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(isResultRecord);
  } catch {
    return EMPTY;
  }
}

function writeStorage(records: ResultRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    /* quota or disabled — silently ignore */
  }
}

function snapshot(): ResultRecord[] {
  if (cache === null) cache = readStorage();
  return cache;
}

function commit(records: ResultRecord[]): void {
  cache = records;
  writeStorage(records);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = readStorage();
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addResult(input: {
  archetype: ArchetypeId;
  locale: Locale;
  path: HistoryEntry[];
}): ResultRecord {
  const record: ResultRecord = {
    id: makeId(),
    timestamp: Date.now(),
    archetype: input.archetype,
    locale: input.locale,
    path: input.path,
  };
  commit([record, ...snapshot()].slice(0, MAX_RESULTS));
  return record;
}

export function clearResults(): void {
  commit([]);
}

export function deleteResult(id: string): void {
  commit(snapshot().filter((r) => r.id !== id));
}

export function useResults(): ResultRecord[] | null {
  return useSyncExternalStore(subscribe, snapshot, getServerSnapshot);
}

function getServerSnapshot(): null {
  return null;
}
