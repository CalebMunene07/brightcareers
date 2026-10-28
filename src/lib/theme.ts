// Site colours. The admin sets them in Settings → Brand colours; they're applied as CSS
// variables (--brand, --brand-dark, --accent) that every page and component already uses.

export type Theme = { brand: string; brandDark: string; accent: string };

export const defaultTheme: Theme = { brand: "#da291c", brandDark: "#7a0d12", accent: "#ffc133" };

const HEX = /^#[0-9a-f]{6}$/i;

export function isHexColor(value: string) {
  return HEX.test(value);
}

/** Builds a theme from saved settings, falling back to the defaults for missing or invalid values. */
export function resolveTheme(s: { brandColor?: string; brandDarkColor?: string; accentColor?: string }): Theme {
  const pick = (v: string | undefined, d: string) => (v && isHexColor(v) ? v.toLowerCase() : d);
  return {
    brand: pick(s.brandColor, defaultTheme.brand),
    brandDark: pick(s.brandDarkColor, defaultTheme.brandDark),
    accent: pick(s.accentColor, defaultTheme.accent),
  };
}

/** CSS that overrides the default colour variables. Values are validated hex colours. */
export function themeCss(t: Theme) {
  return `:root{--brand:${t.brand};--brand-dark:${t.brandDark};--accent:${t.accent};}`;
}

/* ---------------- Contrast (WCAG 2.x) ---------------- */

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Readability problems for the colour pairs the site uses (white text on brand colours, dark text on accent). */
export function contrastWarnings(t: Theme) {
  const checks = [
    { ok: contrastRatio("#ffffff", t.brand) >= 4.5, msg: "White text on the main colour is hard to read. Choose a darker main colour." },
    { ok: contrastRatio("#ffffff", t.brandDark) >= 4.5, msg: "White text on the dark colour is hard to read. Choose a darker dark colour." },
    { ok: contrastRatio(t.brandDark, t.accent) >= 4.5, msg: "Dark text on the accent colour is hard to read. Choose a lighter accent." },
  ];
  return checks.filter((c) => !c.ok).map((c) => c.msg);
}
