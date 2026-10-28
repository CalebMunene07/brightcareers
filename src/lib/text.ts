// Small text helpers shared by admin actions.

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Splits a textarea value into trimmed, non-empty lines. */
export function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Internal paths (/jobs, /contact-us#form) or absolute http(s) links only. */
export function isSafeHref(href: string) {
  return /^\/(?!\/)[^\s]*$/.test(href) || /^https?:\/\/[^\s]+$/.test(href);
}
