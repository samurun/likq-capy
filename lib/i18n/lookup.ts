import type { Dictionary } from "./dictionaries";

export function lookup(dict: Dictionary, path: string): string {
  const parts = path.split(".");
  let cursor: unknown = dict;
  for (const p of parts) {
    if (cursor && typeof cursor === "object" && p in (cursor as object)) {
      cursor = (cursor as Record<string, unknown>)[p];
    } else {
      return path;
    }
  }
  return typeof cursor === "string" ? cursor : path;
}

export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
