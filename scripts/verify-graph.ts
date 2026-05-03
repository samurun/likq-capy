import { NODES, START } from "../lib/quiz/graph";
import {
  ARCHETYPES,
  ARCHETYPE_LIST,
  isArchetypeId,
} from "../lib/quiz/archetypes";
import { archetypeFromHistory } from "../lib/quiz/score";
import {
  ARCHETYPE_IDS,
  TAGS,
  type HistoryEntry,
  type QuestionNode,
  type Choice,
} from "../lib/quiz/types";

import en from "../lib/i18n/en.json";
import th from "../lib/i18n/th.json";

let failed = false;
function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
  failed = true;
}
function pass(msg: string) {
  console.log(`  ✓ ${msg}`);
}

// 1. Graph soundness: every choice points to a real node or null. No cycles.
console.log("\n[1] Graph soundness");
{
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function dfs(id: string, path: string[]): boolean {
    if (visiting.has(id)) {
      fail(`Cycle detected via ${[...path, id].join(" -> ")}`);
      return false;
    }
    if (visited.has(id)) return true;
    visiting.add(id);
    const node = NODES[id];
    if (!node) {
      fail(`Missing node referenced: ${id}`);
      return false;
    }
    let ok = true;
    for (const choice of node.choices) {
      if (choice.next === null) continue;
      if (!NODES[choice.next]) {
        fail(`Node ${id} choice ${choice.id} -> unknown node ${choice.next}`);
        ok = false;
        continue;
      }
      if (!dfs(choice.next, [...path, id])) ok = false;
    }
    visiting.delete(id);
    visited.add(id);
    return ok;
  }
  if (dfs(START, [])) pass("DFS from START — no cycles, all next-ids resolve");

  // Reachability: every defined node should be reachable from START
  const reachable = new Set<string>();
  function walk(id: string) {
    if (reachable.has(id)) return;
    reachable.add(id);
    for (const c of NODES[id]?.choices ?? []) {
      if (c.next) walk(c.next);
    }
  }
  walk(START);
  const orphans = Object.keys(NODES).filter((id) => !reachable.has(id));
  if (orphans.length === 0) pass("All defined nodes reachable from START");
  else fail(`Orphan nodes: ${orphans.join(", ")}`);
}

// 2. Randomized walks: every archetype must be reachable
console.log("\n[2] Archetype reachability (10k random walks)");
{
  const seen = new Set<string>();
  const counts: Record<string, number> = {};
  const RUNS = 10_000;
  let rng = 1;
  const random = () => {
    // deterministic LCG
    rng = (rng * 1664525 + 1013904223) >>> 0;
    return rng / 0xffffffff;
  };

  for (let i = 0; i < RUNS; i++) {
    let cur: string | null = START;
    const history: HistoryEntry[] = [];
    while (cur !== null) {
      const curNode: QuestionNode = NODES[cur];
      const idx = Math.floor(random() * curNode.choices.length);
      const pick: Choice = curNode.choices[idx];
      history.push({ nodeId: cur, choiceId: pick.id });
      cur = pick.next;
    }
    const arch = archetypeFromHistory(history);
    seen.add(arch);
    counts[arch] = (counts[arch] ?? 0) + 1;
  }

  const missing = ARCHETYPE_IDS.filter((a) => !seen.has(a));
  if (missing.length === 0) {
    pass(`All ${ARCHETYPE_IDS.length} archetypes reachable`);
    const distribution = ARCHETYPE_IDS.map(
      (a) => `${a}: ${(((counts[a] ?? 0) / RUNS) * 100).toFixed(1)}%`,
    ).join(", ");
    console.log(`    distribution: ${distribution}`);
  } else {
    fail(`Unreachable archetypes: ${missing.join(", ")}`);
  }
}

// 3. Snapshot scoring: hand-curated walks
console.log("\n[3] Snapshot scoring");
{
  const fixtures: { name: string; choices: [string, string][]; expected: string }[] = [
    {
      name: "all-chill path",
      choices: [
        ["q_intro", "a"],
        ["q_morning", "a"],
        ["q_water", "b"],
        ["q_food", "d"],
        ["q_final", "c"],
      ],
      expected: "zen-master",
    },
    {
      name: "social-first path",
      choices: [
        ["q_intro", "c"],
        ["q_social", "a"],
        ["q_companion", "b"],
        ["q_food", "b"],
        ["q_final", "b"],
      ],
      expected: "social-bather",
    },
    {
      name: "nocturnal path",
      choices: [
        ["q_intro", "d"],
        ["q_night", "c"],
        ["q_water", "a"],
        ["q_food", "c"],
        ["q_final", "a"],
      ],
      expected: "night-owl",
    },
    {
      name: "adventure path",
      choices: [
        ["q_intro", "b"],
        ["q_adventure", "a"],
        ["q_companion", "a"],
        ["q_food", "a"],
        ["q_final", "d"],
      ],
      expected: "adventure-seeker",
    },
  ];

  for (const fx of fixtures) {
    const history: HistoryEntry[] = fx.choices.map(([nodeId, choiceId]) => ({
      nodeId,
      choiceId,
    }));
    const got = archetypeFromHistory(history);
    if (got === fx.expected) pass(`${fx.name} -> ${got}`);
    else fail(`${fx.name}: expected ${fx.expected}, got ${got}`);
  }
}

// 4. i18n parity
console.log("\n[4] i18n parity");
{
  function flatKeys(obj: unknown, prefix = "", out: string[] = []): string[] {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v)) {
          flatKeys(v, path, out);
        } else {
          out.push(path);
        }
      }
    }
    return out;
  }

  const enKeys = flatKeys(en).sort();
  const thKeys = flatKeys(th).sort();
  const onlyEn = enKeys.filter((k) => !thKeys.includes(k));
  const onlyTh = thKeys.filter((k) => !enKeys.includes(k));
  if (onlyEn.length === 0 && onlyTh.length === 0) {
    pass(`en.json and th.json have identical ${enKeys.length} keys`);
  } else {
    if (onlyEn.length) fail(`Keys only in en: ${onlyEn.join(", ")}`);
    if (onlyTh.length) fail(`Keys only in th: ${onlyTh.join(", ")}`);
  }
}

// 5. Every choice's labelKey resolves in both dicts
console.log("\n[5] Question/choice keys resolve in both locales");
{
  function get(obj: unknown, path: string): unknown {
    let cur: unknown = obj;
    for (const p of path.split(".")) {
      if (!cur || typeof cur !== "object") return undefined;
      cur = (cur as Record<string, unknown>)[p];
    }
    return cur;
  }
  let ok = true;
  for (const node of Object.values(NODES)) {
    for (const dictName of ["en", "th"] as const) {
      const dict = dictName === "en" ? en : th;
      const promptKeyPath = `questions.${node.id}.prompt`;
      if (typeof get(dict, promptKeyPath) !== "string") {
        fail(`${dictName} missing ${promptKeyPath}`);
        ok = false;
      }
      for (const choice of node.choices) {
        const path = `questions.${node.id}.choice.${choice.id}`;
        if (typeof get(dict, path) !== "string") {
          fail(`${dictName} missing ${path}`);
          ok = false;
        }
      }
    }
  }
  for (const a of ARCHETYPE_LIST) {
    for (const dictName of ["en", "th"] as const) {
      const dict = dictName === "en" ? en : th;
      const arch = (dict as { archetypes: Record<string, unknown> }).archetypes?.[a.id];
      if (!arch) {
        fail(`${dictName} missing archetype ${a.id}`);
        ok = false;
      }
    }
  }
  if (ok) pass("All question/choice/archetype keys resolve");
}

// 6. Sanity
console.log("\n[6] Sanity");
if (TAGS.length > 0) pass(`${TAGS.length} tags defined`);
if (ARCHETYPES["zen-master"]) pass("Zen Master exists");
if (isArchetypeId("zen-master")) pass("isArchetypeId works");

console.log("");
if (failed) {
  console.error("❌ Verification FAILED");
  process.exit(1);
} else {
  console.log("✅ All checks passed");
}
