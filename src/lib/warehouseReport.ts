/*
  The stack report email (S23, 9/15/26). Server only, imported by
  src/pages/api/warehouse-report.ts. Builds the subject, the HTML, the plain
  text, the Markdown attachment, and the one-line digest for the notification
  from a priced stack. No AI call: the three phases are templated from the
  answers, the reasons come from the page's AI read if there was one.

  Voice: GLF Analytics "we". No prices for GLF work, no fees, no timelines
  with numbers, no dashes, no exclamation points, no credibility labels.
  Nothing here names a client, a lead, or a vertical.
*/
import { LAYERS, type Layer } from "../data/warehouse-catalog";
import { layerCopy, questions, result } from "../data/warehouse-survey";
import {
  budgetFit,
  byId,
  contextFor,
  financeRead,
  moneyRange,
  smallStack,
  stackLines,
  stackToMarkdown,
  VOLUME_LABELS,
  type Answers,
  type Stack
} from "./warehouseCalc";
import { escapeHtml } from "./text";

export type Mentioned = { name: string; id: string | null };
export type ReportInput = {
  answers: Answers;
  stack: Stack;
  reasons: Partial<Record<Layer, string>>;
  summary: string;
  mentioned: Mentioned[];
  answersUrl: string;
  postal: string;
  replyTo: string;
  sentOn: string;
};
export type Report = { subject: string; html: string; text: string; markdown: string; digest: string[] };

const names = Object.fromEntries(LAYERS.map((l) => [l, layerCopy[l].name])) as Record<Layer, string>;

const kindLabel = (v: string) => (questions.find((q) => q.key === "kinds") as { choices: { value: string; label: string }[] }).choices.find((c) => c.value === v)?.label ?? v;

/** Three phases, from the answers only. Deterministic, so the same answers always get the same plan. */
export function buildPhases(a: Answers, stack: Stack): { title: string; lines: string[] }[] {
  const t = (layer: Layer) => stack.lines.find((l) => l.layer === layer)?.tool?.name;
  const firstKinds = a.kinds.slice(0, 2).map(kindLabel);
  const one: string[] = [
    `Stand up ${t("warehouse") ?? "the database"} and load ${firstKinds.length ? firstKinds.join(" and ").toLowerCase() : "the two sources that matter most"} with ${t("ingestion") ?? "the loader"}.`,
    "Write the definitions for the first five metrics before any dashboard. Denominators first.",
    `Ship one report in ${t("bi") ?? "the reporting tool"} that answers the question you typed in the note, or the one you would have.`
  ];
  const two: string[] = [
    `Move the SQL into ${t("modeling") ?? "the modeling layer"} with tests on every model: unique keys, not null, accepted values, a row count against the source.`,
    `Put ${t("orchestration") ?? "the scheduler"} on the loads and the models so nothing depends on a person remembering.`,
    `Turn on ${t("observability") ?? "monitoring"} so a broken load pages someone before the meeting.`
  ];
  if (a.size !== "1") two.push("Add one number per location or unit and the comparison between them.");
  const three: string[] = [`Open the reports to the rest of the ${VOLUME_LABELS[contextFor(a).volume] === "small" ? "team" : "data users"} and set the seat count.`];
  if (a.askAi !== "no") three.push(`Connect ${t("ai") ?? "the LLM layer"} to the modeled tables only, never the raw ones, so plain English questions get governed answers.`);
  if (a.freshness !== "daily") three.push(`Raise the refresh to ${a.freshness === "hourly" ? "hourly" : "real time"} once the daily version has run clean for a few weeks.`);
  three.push(a.runner === "ai" ? `Hand the repo and its CLAUDE.md to your AI coding seat with a person reviewing every change.` : a.runner === "none" ? "Decide who runs it: a partner on call or an AI seat with a person reviewing." : "Hand the repo, the runbook, and the credentials to your team.");
  return [
    { title: "First: land the data and one report", lines: one },
    { title: "Then: model and monitor", lines: two },
    { title: "Then: open it up", lines: three }
  ];
}

const GLF_BLOCK = [
  "We start with your sources and the questions the numbers have to answer, and we fix the definitions before the first dashboard.",
  "AI writes the SQL and the scripts. Every change compiles, passes the tests, completes a dry run, and keeps its lineage before a person reviews it. The AI never writes to production on its own.",
  "Most builds run in weeks and not quarters. You keep the code, the runbook, and the credentials.",
  "After launch your team runs it, with us on call if you want that. Reply to this email and Gabriel will answer."
];

const runsLine = (a: Answers) => result.runs[a.runner];

export function buildReport(i: ReportInput): Report {
  const { answers: a, stack, reasons, summary, mentioned } = i;
  const total = moneyRange(stack.low, stack.high);
  const fit = budgetFit(stack, a);
  const fin = financeRead(stack, a);
  const phases = buildPhases(a, stack);
  const lines = stackLines(stack, names);
  const tradeoffs = stack.lines.filter((l) => l.tool).map((l) => ({ layer: names[l.layer], tool: l.tool!.name, text: l.tool!.tradeoff }));
  const mentionedLines = mentioned.map((m) => {
    const named = m.id ? byId.get(m.id) : undefined;
    if (!named) return result.mentioned.missing(m.name);
    const inStack = stack.lines.find((l) => l.layer === named.layer)?.tool;
    if (inStack?.id === named.id) return result.mentioned.kept(m.name);
    return inStack ? result.mentioned.swappedOut(m.name, inStack.name) : result.mentioned.missing(m.name);
  });
  const financeLines = [
    result.finance.seats(moneyRange(fin.seats[0], fin.seats[1])),
    result.finance.usage(moneyRange(fin.usage[0], fin.usage[1])),
    result.finance.flat(moneyRange(fin.flat[0], fin.flat[1])),
    result.finance.openSource(fin.openSource, fin.layers),
    result.finance.upkeep(fin.upkeep[0], fin.upkeep[1])
  ];
  const notes = [stack.estimates ? result.estimateNote : "", stack.unpriced.length ? result.unpricedNote(stack.unpriced.join(" and ")) : ""].filter(Boolean);
  const subject = `Your data warehouse stack: ${total} a month`;
  const preheader = `${lines.length} layers priced at list. What to build first and how we would run it.`;
  const markdown = stackToMarkdown(stack, a, { names, url: i.answersUrl, reasons: reasons as Record<string, string>, summary, date: i.sentOn });
  const footerNote = "You asked for this one report on glfanalytics.com. It puts you on no list unless you ticked the box for occasional notes. Reply to this email to reach Gabriel Freeman.";

  // ---- plain text ----
  const text = [
    "Your data warehouse stack",
    `Sent ${i.sentOn} by GLF Analytics. ${result.totalLabel}: ${total} a month at list price.`,
    fit === "unsure" ? "" : result.budget[fit],
    smallStack(a) ? result.smallStack : "",
    "",
    ...lines,
    ...(notes.length ? ["", ...notes] : []),
    ...(summary ? ["", summary] : []),
    ...(mentionedLines.length ? ["", ...mentionedLines] : []),
    "",
    runsLine(a),
    "",
    result.financeHeading.toUpperCase(),
    ...financeLines,
    "",
    "TRADEOFFS",
    ...tradeoffs.map((t) => `${t.layer} (${t.tool}): ${t.text}`),
    "",
    result.movesHeading.toUpperCase(),
    ...result.moves,
    "",
    "WHAT TO BUILD FIRST",
    ...phases.flatMap((p) => [p.title, ...p.lines.map((l) => `- ${l}`), ""]),
    "HOW GLF ANALYTICS WOULD BUILD AND RUN IT",
    ...GLF_BLOCK,
    "",
    `Edit the answers or swap a layer: ${i.answersUrl}`,
    "",
    result.listPriceNote,
    ...stack.lines.filter((l) => l.tool).map((l) => `${l.tool!.name}: ${l.tool!.source} (checked ${l.tool!.checked})`),
    "",
    footerNote,
    `GLF Analytics, ${i.postal}`
  ]
    .filter((l) => l !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  // ---- html ----
  const h = escapeHtml;
  const p = (s: string, style = "") => `<p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#222;${style}">${h(s)}</p>`;
  const label = (s: string) => `<p style="margin:28px 0 10px;font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:2px;color:#9a7b2e;text-transform:uppercase">${h(s)}</p>`;
  const rows = stack.lines
    .map((l) => {
      const tool = l.tool ? `${l.tool.name}${l.tool.tier ? ` (${l.tool.tier})` : ""}` : "Not needed";
      const cost = !l.tool ? "" : l.price.notPublished ? "not published" : `${moneyRange(l.price.low, l.price.high)}${l.price.estimate ? " est." : ""}`;
      return `<tr><td style="padding:9px 0;border-bottom:1px solid #e6e6e6;font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:1px;color:#777;text-transform:uppercase;width:150px;vertical-align:top">${h(names[l.layer])}</td><td style="padding:9px 8px;border-bottom:1px solid #e6e6e6;font-size:15px;color:#111;vertical-align:top">${h(tool)}</td><td style="padding:9px 0;border-bottom:1px solid #e6e6e6;font-size:15px;color:#111;text-align:right;white-space:nowrap;vertical-align:top">${h(cost)}</td></tr>`;
    })
    .join("");
  const list = (items: string[]) => `<ul style="margin:0 0 12px;padding-left:18px">${items.map((s) => `<li style="margin:0 0 8px;font-size:15px;line-height:1.55;color:#222">${h(s)}</li>`).join("")}</ul>`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${h(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f4f3f0">${h(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f3f0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e6e6e6"><tr><td style="padding:32px 28px">
<p style="margin:0 0 6px;font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:3px;color:#9a7b2e">GLF ANALYTICS</p>
<h1 style="margin:0 0 6px;font-size:26px;line-height:1.2;font-weight:600;color:#111">Your data warehouse stack</h1>
<p style="margin:0 0 18px;font-size:20px;line-height:1.3;color:#111">${h(total)} <span style="color:#777;font-size:15px">a month at list price</span></p>
${fit === "unsure" ? "" : p(result.budget[fit], "color:#9a7b2e")}
${smallStack(a) ? p(result.smallStack) : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e6e6e6;margin:8px 0 6px">${rows}</table>
${notes.map((n) => p(n, "font-size:13px;color:#666")).join("")}
${summary ? p(summary) : ""}
${mentionedLines.map((m) => p(m)).join("")}
${p(runsLine(a))}
${label(result.financeHeading)}
${list(financeLines)}
${label("Tradeoffs")}
${list(tradeoffs.map((t) => `${t.layer}, ${t.tool}: ${t.text}`))}
${label(result.movesHeading)}
${list(result.moves)}
${label("What to build first")}
${phases.map((ph) => `<p style="margin:14px 0 6px;font-size:15px;font-weight:600;color:#111">${h(ph.title)}</p>${list(ph.lines)}`).join("")}
${label("How GLF Analytics would build and run it")}
${GLF_BLOCK.map((s) => p(s)).join("")}
<p style="margin:22px 0 0"><a href="${h(i.answersUrl)}" style="display:inline-block;padding:12px 18px;background:#D4A853;color:#050505;font-size:14px;font-weight:600;text-decoration:none">Edit the answers or swap a layer</a></p>
${label("Where the prices come from")}
${p(result.listPriceNote, "font-size:13px;color:#666")}
<ul style="margin:0;padding-left:18px">${stack.lines.filter((l) => l.tool).map((l) => `<li style="margin:0 0 6px;font-size:13px;color:#666"><a href="${h(l.tool!.source)}" style="color:#444">${h(l.tool!.name)}</a> checked ${h(l.tool!.checked)}</li>`).join("")}</ul>
</td></tr></table>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px"><tr><td style="padding:18px 28px 0">
<p style="margin:0 0 6px;font-size:12px;line-height:1.5;color:#777">${h(footerNote)}</p>
<p style="margin:0;font-size:12px;line-height:1.5;color:#777">GLF Analytics, ${h(i.postal)}</p>
</td></tr></table>
</td></tr></table>
</body>
</html>`;

  const digest = [
    `Total ${total} a month. Budget ${a.budget}: ${fit}.`,
    ...lines,
    `Runner ${a.runner}. Refresh ${a.freshness}. Size ${a.size}. Readers ${a.readers}. Sources ${a.systems}. Kinds ${a.kinds.join(", ") || "none"}.`,
    `Answers: ${i.answersUrl}`,
    ...(a.notes.trim() ? [`Note: ${a.notes.trim()}`] : [])
  ];

  return { subject, html, text, markdown, digest };
}
