import { ARCHETYPES } from "./archetypes";
import type { ArchetypeId } from "./types";
import type { Accessory } from "@/components/mascots/capy";

const ACCENT_COLORS: Record<string, [string, string]> = {
  "chart-1": ["#f7d985", "#dd9a3c"],
  "chart-2": ["#8fd09a", "#3b8a4d"],
  "chart-3": ["#f3b07b", "#cc7338"],
  "chart-4": ["#f0907a", "#b34a33"],
  "chart-5": ["#9088c2", "#3a2f6b"],
};

const FALLBACK_FONT =
  "'Playpen Sans Thai', 'Noto Sans Thai', system-ui, -apple-system, sans-serif";

type StoryImageInput = {
  archetypeId: ArchetypeId;
  archetypeName: string;
  description: string;
  siteName: string;
  siteUrl: string;
  accent: string;
  ctaTop: string;
  ctaBottom: string;
};

export async function generateStoryImage(
  input: StoryImageInput,
): Promise<Blob | null> {
  const W = 1080;
  const H = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const fontFamily = resolveFontFamily();
  await ensureFontsLoaded(fontFamily);

  const themeColors = readThemeColors();

  const [c1, c2] = ACCENT_COLORS[input.accent] ?? ACCENT_COLORS["chart-1"];

  // background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // soft texture dots
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 60; i += 1) {
    const x = (i * 173) % W;
    const y = (i * 311) % H;
    ctx.beginPath();
    ctx.arc(x, y, 4 + ((i * 7) % 12), 0, Math.PI * 2);
    ctx.fill();
  }

  // card
  const cardX = 80;
  const cardY = 320;
  const cardW = W - 160;
  const cardH = H - 700;
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  roundRect(ctx, cardX, cardY, cardW, cardH, 56);
  ctx.fill();

  // mascot — drawn into the top of the card
  const mascotW = 640;
  const mascotH = (mascotW / 240) * 200; // viewBox 240x200 → keep ratio
  const mascotX = cardX + (cardW - mascotW) / 2;
  const mascotY = cardY + 40;

  const archetype = ARCHETYPES[input.archetypeId];
  const eyes = EYES_BY_ARCHETYPE[input.archetypeId] ?? "open";
  const svg = renderCapySvg({
    accessory: archetype.accessory,
    eyes,
    colors: themeColors,
  });

  try {
    const img = await loadSvgImage(svg);
    ctx.drawImage(img, mascotX, mascotY, mascotW, mascotH);
  } catch {
    /* mascot fails to load — keep going without it */
  }

  ctx.textAlign = "center";

  const textTop = mascotY + mascotH + 30;

  // top label
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.font = `500 34px ${fontFamily}`;
  ctx.fillText(input.ctaTop.toUpperCase(), W / 2, textTop);

  // archetype name
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `600 84px ${fontFamily}`;
  const nameEnd = wrapText(
    ctx,
    input.archetypeName,
    W / 2,
    textTop + 110,
    cardW - 120,
    98,
  );

  // description
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.font = `400 36px ${fontFamily}`;
  wrapText(ctx, input.description, W / 2, nameEnd + 70, cardW - 120, 54);

  // bottom CTA
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = `600 46px ${fontFamily}`;
  ctx.fillText(input.ctaBottom, W / 2, H - 220);

  // url
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = `400 32px ${fontFamily}`;
  const cleanUrl = input.siteUrl.replace(/^https?:\/\//, "");
  ctx.fillText(cleanUrl, W / 2, H - 160);

  // site name watermark
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = `500 30px ${fontFamily}`;
  ctx.fillText(input.siteName, W / 2, 200);

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png", 0.95),
  );
}

const EYES_BY_ARCHETYPE: Record<ArchetypeId, "open" | "closed" | "happy"> = {
  "zen-master": "closed",
  "foodie-lounger": "happy",
  "adventure-seeker": "open",
  "social-bather": "happy",
  "lone-floater": "closed",
  "hot-spring-sage": "closed",
  sunbather: "happy",
  "night-owl": "open",
};

type ThemeColors = {
  capy: string;
  capyShadow: string;
  capyWater: string;
  foreground: string;
  background: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
};

function readThemeColors(): ThemeColors {
  // Resolve each var to a concrete rgb() string by letting the browser
  // compute it. This dodges any oklch-in-SVG rasterization quirks.
  const probe = document.createElement("div");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);

  const resolve = (cssVar: string, fallback: string) => {
    probe.style.color = `var(${cssVar}, ${fallback})`;
    const computed = getComputedStyle(probe).color;
    return computed && computed !== "" ? computed : fallback;
  };

  const colors: ThemeColors = {
    capy: resolve("--capy", "#a48c5e"),
    capyShadow: resolve("--capy-shadow", "#7c6745"),
    capyWater: resolve("--capy-water", "#cfd9e6"),
    foreground: resolve("--foreground", "#1a1a1a"),
    background: resolve("--background", "#ffffff"),
    chart1: resolve("--chart-1", "#e6c069"),
    chart2: resolve("--chart-2", "#6ba867"),
    chart3: resolve("--chart-3", "#d99654"),
    chart4: resolve("--chart-4", "#c8694e"),
    chart5: resolve("--chart-5", "#5d4f8a"),
  };

  document.body.removeChild(probe);
  return colors;
}

function resolveFontFamily(): string {
  if (typeof window === "undefined") return FALLBACK_FONT;
  // Read the resolved font-family from <html> (Tailwind's `font-sans` class
  // applied there resolves to the next/font Playpen Sans Thai stack).
  const family = getComputedStyle(document.documentElement).fontFamily;
  if (family && family.trim()) {
    return `${family}, ${FALLBACK_FONT}`;
  }
  return FALLBACK_FONT;
}

async function ensureFontsLoaded(fontFamily: string) {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    // Pre-load the weights/sizes we render so canvas doesn't fall back.
    await Promise.all([
      document.fonts.load(`400 36px ${fontFamily}`),
      document.fonts.load(`500 30px ${fontFamily}`),
      document.fonts.load(`600 84px ${fontFamily}`),
      document.fonts.load(`600 46px ${fontFamily}`),
    ]);
    await document.fonts.ready;
  } catch {
    /* ignore */
  }
}

function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

function renderCapySvg({
  accessory,
  eyes,
  colors,
}: {
  accessory: Accessory;
  eyes: "open" | "closed" | "happy";
  colors: ThemeColors;
}): string {
  const eyesMarkup =
    eyes === "open"
      ? `
        <circle cx="170" cy="86" r="3" fill="${colors.foreground}" />
        <circle cx="190" cy="84" r="3" fill="${colors.foreground}" />`
      : eyes === "happy"
        ? `
        <path d="M165 85 q5 -6 10 0" stroke="${colors.foreground}" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M186 84 q5 -6 10 0" stroke="${colors.foreground}" stroke-width="2.5" fill="none" stroke-linecap="round" />`
        : `
        <path d="M161 88 h12" stroke="${colors.foreground}" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M182 87 h12" stroke="${colors.foreground}" stroke-width="2.5" fill="none" stroke-linecap="round" />`;

  let accessoryMarkup = "";
  if (accessory === "leaf") {
    accessoryMarkup = `
      <g fill="${colors.chart2}">
        <path d="M158 50 q-12 -18 8 -28 q22 -8 26 14 q-10 22 -34 14 z" />
      </g>
      <path d="M168 38 q6 6 14 8" stroke="${colors.background}" stroke-opacity="0.7" stroke-width="1.5" fill="none" />`;
  } else if (accessory === "sunglasses") {
    accessoryMarkup = `
      <g fill="${colors.chart5}">
        <rect x="158" y="80" width="20" height="12" rx="3" />
        <rect x="184" y="78" width="20" height="12" rx="3" />
      </g>
      <path d="M178 84 h6" stroke="${colors.chart5}" stroke-width="2" fill="none" />`;
  } else if (accessory === "hat") {
    accessoryMarkup = `
      <g fill="${colors.chart4}">
        <path d="M132 60 q40 -36 80 -8 q-2 8 -8 10 q-36 -16 -68 4 q-4 -2 -4 -6 z" />
        <ellipse cx="172" cy="60" rx="40" ry="6" />
      </g>`;
  } else if (accessory === "bowl") {
    accessoryMarkup = `
      <g fill="${colors.chart3}">
        <path d="M40 130 q20 26 50 0 z" />
        <ellipse cx="65" cy="130" rx="25" ry="5" />
      </g>
      <circle cx="58" cy="124" r="3" fill="${colors.chart1}" />
      <circle cx="68" cy="125" r="3" fill="${colors.chart2}" />`;
  } else if (accessory === "towel") {
    accessoryMarkup = `
      <g fill="${colors.chart1}">
        <path d="M132 56 q20 -10 40 -2 q4 8 -2 14 q-22 -8 -38 4 q-4 -8 0 -16 z" />
      </g>
      <path d="M138 60 h28 M140 66 h26" stroke="${colors.background}" stroke-opacity="0.5" stroke-width="1" fill="none" />`;
  } else if (accessory === "moon") {
    accessoryMarkup = `
      <g fill="${colors.chart2}">
        <path d="M40 50 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22 z" />
      </g>`;
  } else if (accessory === "sun") {
    accessoryMarkup = `
      <g fill="${colors.chart1}">
        <circle cx="48" cy="56" r="10" />
      </g>
      <g stroke="${colors.chart1}" stroke-width="2" stroke-linecap="round" fill="none">
        <path d="M48 38 v-6" />
        <path d="M48 80 v-6" />
        <path d="M30 56 h-6" />
        <path d="M72 56 h-6" />
        <path d="M34 42 l-4 -4" />
        <path d="M62 70 l4 4" />
        <path d="M62 42 l4 -4" />
        <path d="M34 70 l-4 4" />
      </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" width="240" height="200">
    <g stroke="${colors.capyWater}" stroke-linecap="round" fill="none" stroke-width="1.5">
      <path d="M20 165 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0" />
      <path d="M30 178 q12 -5 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" />
    </g>
    <ellipse cx="120" cy="130" rx="78" ry="42" fill="${colors.capy}" />
    <ellipse cx="120" cy="142" rx="62" ry="22" fill="${colors.capyShadow}" />
    <ellipse cx="172" cy="92" rx="42" ry="34" fill="${colors.capy}" />
    <ellipse cx="200" cy="100" rx="14" ry="11" fill="${colors.capy}" />
    <circle cx="148" cy="64" r="8" fill="${colors.capyShadow}" />
    <circle cx="180" cy="60" r="8" fill="${colors.capyShadow}" />
    ${eyesMarkup}
    <circle cx="204" cy="98" r="1.4" fill="${colors.capyShadow}" />
    <circle cx="208" cy="103" r="1.4" fill="${colors.capyShadow}" />
    <path d="M196 108 q5 4 10 0" stroke="${colors.capyShadow}" stroke-width="1.6" fill="none" stroke-linecap="round" />
    <ellipse cx="78" cy="170" rx="10" ry="5" fill="${colors.capyShadow}" />
    <ellipse cx="118" cy="172" rx="10" ry="5" fill="${colors.capyShadow}" />
    <ellipse cx="158" cy="170" rx="10" ry="5" fill="${colors.capyShadow}" />
    ${accessoryMarkup}
  </svg>`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const hasSpaces = /\s/.test(text);
  const tokens = hasSpaces ? text.split(/\s+/) : Array.from(text);
  const sep = hasSpaces ? " " : "";
  let line = "";
  let yy = y;

  for (const token of tokens) {
    const test = line ? line + sep + token : token;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = token;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, yy);
    return yy;
  }
  return yy;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function shareBlobOrDownload(
  blob: Blob,
  filename: string,
  shareData: { title?: string; text?: string },
): Promise<"shared" | "downloaded"> {
  const file = new File([blob], filename, { type: blob.type });
  const nav = typeof navigator !== "undefined" ? navigator : null;
  const canShareFile =
    nav &&
    "canShare" in nav &&
    typeof nav.canShare === "function" &&
    nav.canShare({ files: [file] });

  if (canShareFile && nav && "share" in nav) {
    try {
      await nav.share({ ...shareData, files: [file] });
      return "shared";
    } catch {
      // user cancelled or platform denied — fall through
    }
  }
  downloadBlob(blob, filename);
  return "downloaded";
}
