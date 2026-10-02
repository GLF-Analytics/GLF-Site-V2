/*
  The spam screen for both lead forms (S38, 10/2/26). Client-safe: the forms
  import the field name, the routes import screen().

  A screen never blocks. A flagged submit still reaches Gabriel as a
  "[possible spam]" email (no Airtable row, nothing sent to the visitor), so a
  real person caught by mistake is never lost. Before S38 the trap answered OK
  and kept nothing, and the field was named "website", which Chrome autofill
  and password managers can fill on a real visitor's behalf.

  Reasons:
    trap     the hidden field has a value (TRAP_FIELD, or the pre-S38 "website")
    fast     sent under MIN_SUBMIT_MS after the page loaded
    noclock  no load time sent: the post did not come from the page's script
*/

/** A name no autofill or password manager maps to a profile field. Never "website", "url", "company", "email". */
export const TRAP_FIELD = "hp_field_7";
export const MIN_SUBMIT_MS = 3_000;

export type ScreenReason = "trap" | "fast" | "noclock";

export function screen(body: Record<string, unknown>): ScreenReason | null {
  const filled = (v: unknown) => typeof v === "string" && v.trim() !== "";
  if (filled(body[TRAP_FIELD]) || filled(body.website)) return "trap";
  const elapsed = body.elapsed;
  if (typeof elapsed !== "number" || !Number.isFinite(elapsed)) return "noclock";
  if (elapsed < MIN_SUBMIT_MS) return "fast";
  return null;
}
