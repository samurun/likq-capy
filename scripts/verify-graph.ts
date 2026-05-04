import { activeTheme } from "../lib/themes/active";
import { NODES, START } from "../lib/quiz/graph";
import {
  ARCHETYPES,
  ARCHETYPE_LIST,
  isArchetypeId,
} from "../lib/quiz/archetypes";
import { archetypeFromHistory } from "../lib/quiz/score";
import { LOCALES, type HistoryEntry } from "../lib/quiz/types";
import type { ThemeChoice, ThemeQuestion } from "../lib/themes/types";

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
      const curNode: ThemeQuestion = NODES[cur];
      const idx = Math.floor(random() * curNode.choices.length);
      const pick: ThemeChoice = curNode.choices[idx];
      history.push({ nodeId: cur, choiceId: pick.id });
      cur = pick.next;
    }
    const arch = archetypeFromHistory(history);
    seen.add(arch);
    counts[arch] = (counts[arch] ?? 0) + 1;
  }

  const ids = Object.keys(activeTheme.archetypes);
  const missing = ids.filter((a) => !seen.has(a));
  if (missing.length === 0) {
    pass(`All ${ids.length} archetypes reachable`);
    const distribution = ids
      .map((a) => `${a}: ${(((counts[a] ?? 0) / RUNS) * 100).toFixed(1)}%`)
      .join(", ");
    console.log(`    distribution: ${distribution}`);
  } else {
    fail(`Unreachable archetypes: ${missing.join(", ")}`);
  }
}

// 3. Snapshot scoring: hand-curated walks (theme-specific, only run when the
// active theme matches a known fixture).
console.log("\n[3] Snapshot scoring");
{
  const fixturesByTheme: Record<
    string,
    { name: string; choices: [string, string][]; expected: string }[]
  > = {
    "capybara-cozy": [
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
    ],
  };

  const fixtures = fixturesByTheme[activeTheme.id];
  if (!fixtures) {
    pass(`No fixtures for theme '${activeTheme.id}' — skipped`);
  } else {
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
}

// 4. i18n parity: every theme string is present in every locale
console.log("\n[4] Theme i18n parity");
{
  let ok = true;
  const checkPair = (label: string, value: Record<string, string>) => {
    for (const loc of LOCALES) {
      const v = value[loc];
      if (typeof v !== "string" || v.length === 0) {
        fail(`${label}: missing/empty locale '${loc}'`);
        ok = false;
      }
    }
  };
  const checkList = (label: string, value: Record<string, string[]>) => {
    for (const loc of LOCALES) {
      const v = value[loc];
      if (!Array.isArray(v) || v.length === 0) {
        fail(`${label}: missing/empty list locale '${loc}'`);
        ok = false;
      }
    }
  };

  // meta
  checkPair("meta.siteName", activeTheme.meta.siteName);
  checkPair("meta.tagline", activeTheme.meta.tagline);
  checkPair("meta.ogTitle", activeTheme.meta.ogTitle);
  checkPair("meta.ogDescription", activeTheme.meta.ogDescription);

  // questions
  for (const [id, node] of Object.entries(activeTheme.questions)) {
    checkPair(`question ${id}.prompt`, node.prompt);
    for (const choice of node.choices) {
      checkPair(`question ${id}.choice.${choice.id}.label`, choice.label);
    }
  }

  // archetypes
  for (const [id, arch] of Object.entries(activeTheme.archetypes)) {
    checkPair(`archetype ${id}.name`, arch.name);
    checkPair(`archetype ${id}.description`, arch.description);
    checkList(`archetype ${id}.traits`, arch.traits);
  }

  if (ok)
    pass(
      `All theme strings (meta + ${Object.keys(activeTheme.questions).length} questions + ${Object.keys(activeTheme.archetypes).length} archetypes) present in all ${LOCALES.length} locales`,
    );
}

// 5. Tag wiring: every choice tag and every archetype profile tag must be
// declared in theme.tags
console.log("\n[5] Tag wiring");
{
  let ok = true;
  const declared = new Set(activeTheme.tags);
  for (const [id, node] of Object.entries(activeTheme.questions)) {
    for (const choice of node.choices) {
      for (const tag of Object.keys(choice.tags)) {
        if (!declared.has(tag)) {
          fail(`question ${id}/${choice.id} uses undeclared tag '${tag}'`);
          ok = false;
        }
      }
    }
  }
  for (const [id, arch] of Object.entries(activeTheme.archetypes)) {
    for (const tag of Object.keys(arch.profile)) {
      if (!declared.has(tag)) {
        fail(`archetype ${id} profile uses undeclared tag '${tag}'`);
        ok = false;
      }
    }
  }
  if (ok) pass(`All tags used resolve in theme.tags (${activeTheme.tags.length} declared)`);
}

// 6. Sanity
console.log("\n[6] Sanity");
if (activeTheme.tags.length > 0) pass(`${activeTheme.tags.length} tags defined`);
if (ARCHETYPES[ARCHETYPE_LIST[0].id]) pass(`first archetype '${ARCHETYPE_LIST[0].id}' resolves`);
if (isArchetypeId(ARCHETYPE_LIST[0].id)) pass("isArchetypeId works");

console.log("");
if (failed) {
  console.error("❌ Verification FAILED");
  process.exit(1);
} else {
  console.log("✅ All checks passed");
}
