/*
  Small text helpers shared by the server routes and libraries (S23, 9/15/26).
  Kept dependency-free so /api/warehouse-report never pulls the Anthropic SDK
  into its function bundle.
*/

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Visitor-facing text from the model or the visitor: no dashes, no dollar figures, one line, capped. */
export const clean = (s: string, max: number) =>
  s.replace(/[–—]/g, ", ").replace(/\$\s?\d[\d,.]*/g, "").replace(/\s+/g, " ").trim().slice(0, max);

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const byteLength = (s: string) => new TextEncoder().encode(s).byteLength;
